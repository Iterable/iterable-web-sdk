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
  ENDPOINTS,
  DEFAULT_EVENT_THRESHOLD_LIMIT,
  SHARED_PREF_ANON_USAGE_TRACKED,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
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
import config from '../utils/config';

// Type definitions for anonymous event data objects
interface AnonTrackEventData {
  eventName: string;
  createdAt: number;
  dataFields?: Record<string, any>;
  createNewFields: boolean;
  eventType: string;
}

interface AnonTrackPurchaseData {
  items: any[];
  createdAt: number;
  dataFields?: Record<string, any>;
  total: number;
  eventType: string;
}

interface AnonUpdateCartData {
  items: any[];
  eventType: string;
  preferUserId: boolean;
  createdAt: number;
}

interface AnonUserUpdateData extends Record<string, any> {
  eventType: string;
}

type AnonEventData =
  | AnonTrackEventData
  | AnonTrackPurchaseData
  | AnonUpdateCartData;

type AnonUserFunction = (userId: string) => void;

let anonUserIdSetter: AnonUserFunction | null = null;

export function registerAnonUserIdSetter(setterFunction: AnonUserFunction) {
  anonUserIdSetter = setterFunction;
}

export function isAnonymousUsageTracked(): boolean {
  const anonymousUsageTracked = localStorage.getItem(
    SHARED_PREF_ANON_USAGE_TRACKED
  );
  return anonymousUsageTracked === 'true';
}

export class AnonymousUserEventManager {
  updateAnonSession() {
    try {
      const anonymousUsageTracked = isAnonymousUsageTracked();

      if (!anonymousUsageTracked) return;

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
    const anonymousUsageTracked = isAnonymousUsageTracked();

    if (!anonymousUsageTracked) return;

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
    this.storeEventListToLocalStorage(newDataObject);
  }

  async trackAnonUpdateUser(payload: UpdateUserParams) {
    const newDataObject = {
      ...payload.dataFields,
      [SHARED_PREFS_EVENT_TYPE]: UPDATE_USER
    };
    this.storeUserUpdateToLocalStorage(newDataObject);
  }

  async trackAnonPurchaseEvent(payload: TrackPurchaseRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_TOTAL]: payload.total,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_PURCHASE
    };
    this.storeEventListToLocalStorage(newDataObject);
  }

  async trackAnonUpdateCart(payload: UpdateCartRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_UPDATE_CART,
      [KEY_PREFER_USERID]: true,
      [KEY_CREATED_AT]: this.getCurrentTime()
    };
    this.storeEventListToLocalStorage(newDataObject);
  }

  private checkCriteriaCompletion(): string | null {
    const criteriaData = localStorage.getItem(SHARED_PREFS_CRITERIA);
    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );
    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );
    try {
      if (criteriaData && localStoredEventList) {
        const checker = new CriteriaCompletionChecker(
          localStoredEventList,
          localStoredUserUpdate
        );
        return checker.getMatchedCriteria(criteriaData);
      }
    } catch (error) {
      console.error('checkCriteriaCompletion', error);
    }

    return null;
  }

  private async createAnonymousUser(criteriaId: string) {
    const anonymousUsageTracked = isAnonymousUsageTracked();

    if (!anonymousUsageTracked) return;

    const userData = localStorage.getItem(SHARED_PREFS_ANON_SESSIONS);
    const strUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );
    const dataFields = strUserUpdate ? JSON.parse(strUserUpdate) : {};

    delete dataFields[SHARED_PREFS_EVENT_TYPE];

    const userId = uuidv4();

    if (userData) {
      const userSessionInfo = JSON.parse(userData);
      const userDataJson = userSessionInfo[SHARED_PREFS_ANON_SESSIONS];
      const payload: TrackAnonSessionParams = {
        user: {
          userId,
          mergeNestedObjects: true,
          createNewFields: true,
          dataFields
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
        localStorage.removeItem(SHARED_PREFS_USER_UPDATE_OBJECT_KEY);

        const onAnonUserCreated = config.getConfig('onAnonUserCreated');

        if (onAnonUserCreated) {
          onAnonUserCreated(userId);
        }
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

    const strUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );
    const userUpdateObject = strUserUpdate ? JSON.parse(strUserUpdate) : {};

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
            default:
              break;
          }
          this.removeAnonSessionCriteriaData();
        }
      );
    }

    if (Object.keys(userUpdateObject).length) {
      // eslint-disable-next-line no-param-reassign
      delete userUpdateObject[SHARED_PREFS_EVENT_TYPE];
      this.updateUser(userUpdateObject);
    }
  }

  removeAnonSessionCriteriaData() {
    localStorage.removeItem(SHARED_PREFS_ANON_SESSIONS);
    localStorage.removeItem(SHARED_PREFS_EVENT_LIST_KEY);
    localStorage.removeItem(SHARED_PREFS_USER_UPDATE_OBJECT_KEY);
  }

  private async storeEventListToLocalStorage(newDataObject: AnonEventData) {
    const anonymousUsageTracked = isAnonymousUsageTracked();

    if (!anonymousUsageTracked) return;

    const strTrackEventList = localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY);
    let previousDataArray = [];

    if (strTrackEventList) {
      previousDataArray = JSON.parse(strTrackEventList);
    }

    previousDataArray.push(newDataObject);

    // - The code below limits the number of events stored in local storage.
    // - The event list acts as a queue, with the oldest events being deleted
    //   when new events are stored once the event threshold limit is reached.

    const eventThresholdLimit =
      (config.getConfig('eventThresholdLimit') as number) ??
      DEFAULT_EVENT_THRESHOLD_LIMIT;
    if (previousDataArray.length > eventThresholdLimit) {
      previousDataArray = previousDataArray.slice(
        previousDataArray.length - eventThresholdLimit
      );
    }

    localStorage.setItem(
      SHARED_PREFS_EVENT_LIST_KEY,
      JSON.stringify(previousDataArray)
    );
    const criteriaId = this.checkCriteriaCompletion();
    if (criteriaId !== null) {
      this.createAnonymousUser(criteriaId);
    }
  }

  private async storeUserUpdateToLocalStorage(
    newDataObject: AnonUserUpdateData
  ) {
    const anonymousUsageTracked = isAnonymousUsageTracked();

    if (!anonymousUsageTracked) return;

    const strUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );
    let userUpdateObject = {};

    if (strUserUpdate) {
      userUpdateObject = JSON.parse(strUserUpdate);
    }

    userUpdateObject = {
      ...userUpdateObject,
      ...newDataObject
    };

    localStorage.setItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
      JSON.stringify(userUpdateObject)
    );
    const criteriaId = this.checkCriteriaCompletion();
    if (criteriaId !== null) {
      this.createAnonymousUser(criteriaId);
    }
  }

  private getCurrentTime = () => {
    const dateInMillis = new Date().getTime();
    const dateInSeconds = Math.floor(dateInMillis / 1000);
    return dateInSeconds;
  };

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
