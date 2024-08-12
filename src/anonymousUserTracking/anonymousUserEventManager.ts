/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateCartRequestParams,
  TrackPurchaseRequestParams
} from '../commerce/types';

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
  UPDATE_USER,
  TRACK_UPDATE_CART,
  SHARED_PREFS_CRITERIA,
  SHARED_PREFS_ANON_SESSIONS,
  ENDPOINT_TRACK_ANON_SESSION,
  WEB_PLATFORM,
  KEY_PREFER_USERID,
  ENDPOINTS
} from '../constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import CriteriaCompletionChecker from './criteriaCompletionChecker';
import { TrackAnonSessionParams } from '../utils/types';
import { UpdateUserParams } from '../users/types';
import { trackSchema } from '../events/events.schema';
import {
  trackPurchaseSchema,
  updateCartSchema
} from '../commerce/commerce.schema';
import { updateUserSchema } from '../users/users.schema';
import { InAppTrackRequestParams } from '../events';

type AnonUserFunction = (userId: string) => void;

let anonUserIdSetter: AnonUserFunction | null = null;

export function registerAnonUserIdSetter(setterFunction: AnonUserFunction) {
  anonUserIdSetter = setterFunction;
}
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
      ...payload.dataFields,
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
      [KEY_PREFER_USERID]: true,
      [KEY_CREATED_AT]: this.getCurrentTime()
    };
    this.storeEventListToLocalStorage(newDataObject, false);
  }

  private checkCriteriaCompletion(): string | null {
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
          matchedCriteriaId: parseInt(criteriaId, 10),
          webPushOptIn:
            this.getWebPushOptnIn() !== '' ? this.getWebPushOptnIn() : undefined
        }
      };
      const response = await baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINT_TRACK_ANON_SESSION,
        data: payload
      }).catch((e) => {
        if (e?.response?.status === 409) {
          this.getAnonCriteria();
        }
      });
      if (response?.status === 200) {
        if (anonUserIdSetter !== null) {
          await anonUserIdSetter(userId);
        }
        this.syncEvents();
      }
    }
  }

  async syncEvents() {
    const strTrackEventList = localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY);
    const trackEventList = strTrackEventList
      ? JSON.parse(strTrackEventList)
      : [];

    if (trackEventList.length) {
      trackEventList.forEach(
        (
          event: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => {
          const eventType = event[SHARED_PREFS_EVENT_TYPE];
          // eslint-disable-next-line no-param-reassign
          delete event.eventType;
          switch (eventType) {
            case TRACK_EVENT: {
              this.track(event);
              break;
            }
            case TRACK_PURCHASE: {
              this.trackPurchase(event);
              break;
            }
            case TRACK_UPDATE_CART: {
              this.updateCart(event);
              break;
            }
            case UPDATE_USER: {
              this.updateUser({ dataFields: event });
              break;
            }
            default:
              break;
          }
          this.removeAnonSessionCriteriaData();
        }
      );
    }
  }

  removeAnonSessionCriteriaData() {
    localStorage.removeItem(SHARED_PREFS_ANON_SESSIONS);
    localStorage.removeItem(SHARED_PREFS_EVENT_LIST_KEY);
  }

  private async storeEventListToLocalStorage(
    newDataObject: Record<
      any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
      any /* eslint-disable-line @typescript-eslint/no-explicit-any */
    >,
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
        const dataToUpdate = previousDataArray[indexToUpdate];

        previousDataArray[indexToUpdate] = {
          ...dataToUpdate,
          ...newDataObject
        };
      } else {
        previousDataArray.push(newDataObject);
      }
    } else {
      previousDataArray.push(newDataObject);
    }

    localStorage.setItem(
      SHARED_PREFS_EVENT_LIST_KEY,
      JSON.stringify(previousDataArray)
    );
    const criteriaId = this.checkCriteriaCompletion();
    if (criteriaId !== null) {
      this.createKnownUser(criteriaId);
    }
  }

  private getCurrentTime = () => new Date().getTime();

  private getWebPushOptnIn(): string {
    const notificationManager = window.Notification;
    if (notificationManager && notificationManager.permission === 'granted') {
      return window.location.hostname;
    }
    return '';
  }

  track = (payload: InAppTrackRequestParams) =>
    baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: ENDPOINTS.event_track.route,
      data: payload,
      validation: {
        data: trackSchema
      }
    });

  updateCart = (payload: UpdateCartRequestParams) =>
    baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: ENDPOINTS.commerce_update_cart.route,
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

  trackPurchase = (payload: TrackPurchaseRequestParams) =>
    baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: ENDPOINTS.commerce_track_purchase.route,
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

  updateUser = (payload: UpdateUserParams = {}) => {
    if (payload.dataFields) {
      return baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINTS.users_update.route,
        data: {
          ...payload,
          preferUserId: true
        },
        validation: {
          data: updateUserSchema
        }
      });
    }
    return null;
  };
}
