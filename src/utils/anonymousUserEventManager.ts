import {
  UpdateCartRequestParams,
  TrackPurchaseRequestParams
} from '../commerce/types';
import { InAppTrackRequestParams } from '../events/types';
import {
  GET_CRITERIA_PATH,
  KEY_EVENT_NAME,
  KEY_CREATED_AT,
  KEY_DATA_FIELDS,
  KEY_CREATE_NEW_FIELDS,
  SHARED_PREFS_EVENT_TYPE,
  TRACK_EVENT,
  SHARED_PREFS_EVENT_LIST_KEY,
  KEY_ITEMS,
  KEY_TOTAL,
  TRACK_PURCHASE,
  DATA_REPLACE,
  UPDATE_USER,
  TRACK_UPDATE_CART,
  SHARED_PREFS_CRITERIA,
  SHARED_PREFS_ANON_SESSIONS,
  SHARED_PREF_USER_ID,
  SHARED_PREF_EMAIL,
  ENDPOINT_TRACK_ANON_SESSION,
  WEB_PLATFORM
} from 'src/constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import CriteriaCompletionChecker from './criteriaCompletionChecker';
import { v4 as uuidv4 } from 'uuid';
import { TrackAnonSessionParams } from './types';
import {
  trackPurchaseSchema,
  updateCartSchema
} from 'src/commerce/commerce.schema';
import { trackSchema } from 'src/events/events.schema';
import { UpdateUserParams } from 'src/users';
import { updateUserSchema } from 'src/users/users.schema';

export class AnonymousUserEventManager {
  updateAnonSession() {
    try {
      const strAnonSessionInfo = localStorage.getItem(
        SHARED_PREFS_ANON_SESSIONS
      );
      let anonSessionInfo: {
        itbl_anon_sessions?: {
          number_of_sessions?: number;
          first_session?: number;
          last_session?: number;
        };
      } = {};

      if (strAnonSessionInfo) {
        anonSessionInfo = JSON.parse(strAnonSessionInfo);
      }

      // Update existing values or set them if they don't exist
      anonSessionInfo.itbl_anon_sessions =
        anonSessionInfo.itbl_anon_sessions || {};
      anonSessionInfo.itbl_anon_sessions.number_of_sessions =
        (anonSessionInfo.itbl_anon_sessions.number_of_sessions || 0) + 1;
      anonSessionInfo.itbl_anon_sessions.first_session =
        anonSessionInfo.itbl_anon_sessions.first_session ||
        this.getCurrentTime();
      anonSessionInfo.itbl_anon_sessions.last_session = this.getCurrentTime();

      // Update the structure to the desired format
      const outputObject = {
        itbl_anon_sessions: anonSessionInfo.itbl_anon_sessions
      };

      localStorage.setItem(
        SHARED_PREFS_ANON_SESSIONS,
        JSON.stringify(outputObject)
      );
    } catch (error) {
      console.error('Error updating anonymous session:', error);
    }
  }

  getAnonCriteria() {
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: GET_CRITERIA_PATH,
      data: {},
      validation: {}
    })
      .then((response) => {
        const criteriaData: any = response.data;
        if (criteriaData) {
          localStorage.setItem(
            SHARED_PREFS_CRITERIA,
            JSON.stringify(criteriaData)
          );
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }

  async trackAnonEvent(payload: InAppTrackRequestParams) {
    const newDataObject = {
      [KEY_EVENT_NAME]: payload.eventName,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_CREATE_NEW_FIELDS]: true,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_EVENT
    };
    this.storeEventListToLocalStorage(newDataObject, false);
  }

  async trackAnonUpdateUser(payload: UpdateUserParams) {
    const newDataObject = {
      [DATA_REPLACE]: payload.dataFields,
      [SHARED_PREFS_EVENT_TYPE]: UPDATE_USER
    };
    this.storeEventListToLocalStorage(newDataObject, true);
  }

  async trackAnonPurchaseEvent(payload: TrackPurchaseRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_TOTAL]: payload.total,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_PURCHASE
    };
    this.storeEventListToLocalStorage(newDataObject, false);
  }

  async trackAnonUpdateCart(payload: UpdateCartRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_UPDATE_CART,
      [KEY_CREATED_AT]: this.getCurrentTime()
    };
    this.storeEventListToLocalStorage(newDataObject, false);
  }

  private async checkCriteriaCompletion() {
    const criteriaData = localStorage.getItem(SHARED_PREFS_CRITERIA);
    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    try {
      if (criteriaData && localStoredEventList) {
        const checker = new CriteriaCompletionChecker(localStoredEventList);
        return checker.getMatchedCriteria(criteriaData);
      }
    } catch (error) {
      console.error('checkCriteriaCompletion', error);
    }

    return null;
  }

  private async createKnownUser(criteriaId: string) {
    const userData = localStorage.getItem(SHARED_PREFS_ANON_SESSIONS);
    const userId = uuidv4();

    if (userData) {
      const userSessionInfo = JSON.parse(userData);
      const userDataJson = userSessionInfo[SHARED_PREFS_ANON_SESSIONS];
      const payload: TrackAnonSessionParams = {
        user: {
          userId,
          preferUserId: true,
          mergeNestedObjects: true,
          createNewFields: true
        },
        createdAt: this.getCurrentTime(),
        deviceInfo: {
          appPackageName: window.location.hostname,
          deviceId: global.navigator.userAgent || '',
          platform: WEB_PLATFORM
        },
        anonSessionContext: {
          totalAnonSessionCount: userDataJson.number_of_sessions,
          lastAnonSession: userDataJson.last_session,
          firstAnonSession: userDataJson.first_session,
          matchedCriteriaId: parseInt(criteriaId),
          webPushOptIn:
            this.getWebPushOptnIn() !== '' ? this.getWebPushOptnIn() : undefined
        }
      };

      setTimeout(async () => {
        const response = await baseIterableRequest<IterableResponse>({
          method: 'POST',
          url: ENDPOINT_TRACK_ANON_SESSION,
          data: payload
        }).catch((e) => {
          if (e?.response?.status === 409) {
            this.getAnonCriteria();
          }
        });
        if (response && response.status === 200) {
          this.setUserID(userId);
          this.syncEvents();
        }
      }, 500);
    } else {
      this.syncEvents();
    }
  }

  async syncEvents() {
    const strTrackEventList = localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY);
    const trackEventList = strTrackEventList
      ? JSON.parse(strTrackEventList)
      : [];

    if (trackEventList.length) {
      for (let i = 0; i < trackEventList.length; i++) {
        const event = trackEventList[i];
        const eventType = event[SHARED_PREFS_EVENT_TYPE];

        switch (eventType) {
          case TRACK_EVENT: {
            await this.track(event);
            break;
          }
          case TRACK_PURCHASE: {
            let userDataJson = {};
            if (this.getEmail() !== null) {
              userDataJson = {
                [SHARED_PREF_EMAIL]: this.getEmail()
              };
            } else {
              userDataJson = {
                [SHARED_PREF_USER_ID]: this.getUserID()
              };
            }
            event.user = userDataJson;
            await this.trackPurchase(event);
            break;
          }
          case TRACK_UPDATE_CART: {
            await this.updateCart(event);
            break;
          }
          case UPDATE_USER: {
            await this.updateUser(event);
            break;
          }
          default: {
            break;
          }
        }

        localStorage.removeItem(SHARED_PREFS_ANON_SESSIONS);
        localStorage.removeItem(SHARED_PREFS_EVENT_LIST_KEY);
      }
    }
  }

  private async storeEventListToLocalStorage(
    newDataObject: any,
    shouldOverWrite: boolean
  ) {
    const strTrackEventList = localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY);
    let previousDataArray = [];

    if (strTrackEventList) {
      previousDataArray = JSON.parse(strTrackEventList);
    }

    if (shouldOverWrite) {
      const trackingType = newDataObject[SHARED_PREFS_EVENT_TYPE];
      const indexToUpdate = previousDataArray.findIndex(
        (obj: any) => obj[SHARED_PREFS_EVENT_TYPE] === trackingType
      );
      if (indexToUpdate !== -1) {
        previousDataArray[indexToUpdate] = newDataObject;
      }
    } else {
      previousDataArray.push(newDataObject);
    }

    localStorage.setItem(
      SHARED_PREFS_EVENT_LIST_KEY,
      JSON.stringify(previousDataArray)
    );

    const criteriaId = await this.checkCriteriaCompletion();
    if (criteriaId !== null) {
      this.createKnownUser(criteriaId);
    }
  }

  private getCurrentTime = () => {
    return new Date().getTime();
  };

  private getWebPushOptnIn(): string {
    const notificationManager = window.Notification;
    if (notificationManager && notificationManager.permission === 'granted') {
      return window.location.hostname;
    } else {
      return '';
    }
  }

  track = (payload: InAppTrackRequestParams) => {
    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: '/events/track',
      data: payload,
      validation: {
        data: trackSchema
      }
    });
  };

  updateCart = (payload: UpdateCartRequestParams) => {
    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: '/commerce/updateCart',
      data: {
        ...payload,
        user: {
          ...payload.user,
          preferUserId: true
        }
      },
      validation: {
        data: updateCartSchema
      }
    });
  };

  trackPurchase = (payload: TrackPurchaseRequestParams) => {
    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: '/commerce/trackPurchase',
      data: {
        ...payload,
        user: {
          ...payload.user,
          preferUserId: true
        }
      },
      validation: {
        data: trackPurchaseSchema
      }
    });
  };

  updateUser = (payload: UpdateUserParams = {}) => {
    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: '/users/update',
      data: {
        ...payload,
        preferUserId: true
      },
      validation: {
        data: updateUserSchema
      }
    });
  };
  setUserID = (userId: string) => {
    localStorage.setItem(SHARED_PREF_USER_ID, userId);
  };

  getUserID = (): string | null => {
    return localStorage.getItem(SHARED_PREF_USER_ID);
  };

  getEmail = (): string | null => {
    return localStorage.getItem(SHARED_PREF_EMAIL);
  };
}
