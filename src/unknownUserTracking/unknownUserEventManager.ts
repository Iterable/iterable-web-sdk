/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateCartRequestParams,
  TrackPurchaseRequestParams,
  CommerceItem
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
  SHARED_PREFS_UNKNOWN_SESSIONS,
  ENDPOINT_TRACK_UNKNOWN_SESSION,
  ENDPOINT_UNKNOWN_USER_CONSENT,
  WEB_PLATFORM,
  KEY_PREFER_USERID,
  ENDPOINTS,
  DEFAULT_EVENT_THRESHOLD_LIMIT,
  SHARED_PREF_CONSENT_TIMESTAMP,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
  SHARED_PREF_UNKNOWN_USER_ID,
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID
} from '../constants';
import { baseIterableRequest } from '../request';
import { getTypeOfAuth } from '../utils/typeOfAuth';
import { IterableResponse } from '../types';
import CriteriaCompletionChecker from './criteriaCompletionChecker';
import {
  TrackUnknownSessionParams,
  ConsentRequestParams
} from '../utils/types';
import { UpdateUserParams } from '../users/types';
import { trackSchema } from '../events/events.schema';
import {
  trackPurchaseSchema,
  updateCartSchema
} from '../commerce/commerce.schema';
import { updateUserSchema } from '../users/users.schema';
import { InAppTrackRequestParams } from '../events';
import { config } from '../utils/config';

import { consentRequestSchema } from './consent.schema';

// Type definitions for unknown event data objects
type UnknownTrackEventData = {
  eventName: string;
  createdAt: number;
  dataFields?: Record<string, any>;
  createNewFields: boolean;
  eventType: string;
};

type UnknownTrackPurchaseData = {
  items: CommerceItem[];
  createdAt: number;
  dataFields?: Record<string, any>;
  total: number;
  eventType: string;
};

type UnknownUpdateCartData = {
  items: CommerceItem[];
  eventType: string;
  preferUserId: boolean;
  createdAt: number;
};

type UnknownUserUpdateData = Record<string, any> & {
  eventType: string;
};

type UnknownEventData =
  | UnknownTrackEventData
  | UnknownTrackPurchaseData
  | UnknownUpdateCartData;

type UnknownUserFunction = (userId: string) => void;

let unknownUserIdSetter: UnknownUserFunction | null = null;

export function registerUnknownUserIdSetter(
  setterFunction: UnknownUserFunction
) {
  unknownUserIdSetter = setterFunction;
}

export function isUnknownUsageTracked(): boolean {
  // Check both configuration AND user consent
  const isEnabled = config.getConfig('enableUnknownActivation') || false;
  if (!isEnabled) return false;

  // Also check if user has given consent (consent timestamp exists)
  const consentTimestamp = localStorage.getItem(SHARED_PREF_CONSENT_TIMESTAMP);
  return consentTimestamp !== null;
}

export class UnknownUserEventManager {
  updateUnknownSession() {
    try {
      const unknownUsageTracked = isUnknownUsageTracked();

      if (!unknownUsageTracked) return;

      const strUnknownSessionInfo = localStorage.getItem(
        SHARED_PREFS_UNKNOWN_SESSIONS
      );
      let unknownSessionInfo: {
        itbl_unknown_sessions?: {
          number_of_sessions?: number;
          first_session?: number;
          last_session?: number;
        };
      } = {};

      if (strUnknownSessionInfo) {
        unknownSessionInfo = JSON.parse(strUnknownSessionInfo);
      }

      // Update existing values or set them if they don't exist
      unknownSessionInfo.itbl_unknown_sessions =
        unknownSessionInfo.itbl_unknown_sessions || {};
      unknownSessionInfo.itbl_unknown_sessions.number_of_sessions =
        (unknownSessionInfo.itbl_unknown_sessions.number_of_sessions || 0) + 1;
      unknownSessionInfo.itbl_unknown_sessions.first_session =
        unknownSessionInfo.itbl_unknown_sessions.first_session ||
        this.getCurrentTime();
      unknownSessionInfo.itbl_unknown_sessions.last_session =
        this.getCurrentTime();

      // Update the structure to the desired format
      const outputObject = {
        itbl_unknown_sessions: unknownSessionInfo.itbl_unknown_sessions
      };

      localStorage.setItem(
        SHARED_PREFS_UNKNOWN_SESSIONS,
        JSON.stringify(outputObject)
      );
    } catch (error) {
      console.error('Error updating unknown session:', error);
    }
  }

  getUnknownCriteria() {
    const unknownUsageTracked = isUnknownUsageTracked();

    if (!unknownUsageTracked) return;

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

  async trackUnknownEvent(payload: InAppTrackRequestParams) {
    const newDataObject = {
      [KEY_EVENT_NAME]: payload.eventName,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_CREATE_NEW_FIELDS]: true,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_EVENT
    };
    this.storeEventListToLocalStorage(newDataObject);
  }

  async trackUnknownUpdateUser(payload: UpdateUserParams) {
    const newDataObject = {
      ...payload.dataFields,
      [SHARED_PREFS_EVENT_TYPE]: UPDATE_USER
    };
    this.storeUserUpdateToLocalStorage(newDataObject);
  }

  async trackUnknownPurchaseEvent(payload: TrackPurchaseRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_TOTAL]: payload.total,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_PURCHASE
    };
    this.storeEventListToLocalStorage(newDataObject);
  }

  async trackUnknownUpdateCart(payload: UpdateCartRequestParams) {
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
      if (criteriaData && (localStoredEventList || localStoredUserUpdate)) {
        const checker = new CriteriaCompletionChecker(
          localStoredEventList,
          localStoredUserUpdate
        );
        const result = checker.getMatchedCriteria(criteriaData);
        return result;
      }
    } catch (error) {
      console.error('checkCriteriaCompletion', error);
    }

    return null;
  }

  public async createUnknownUser(criteriaId: string) {
    const unknownUsageTracked = isUnknownUsageTracked();

    if (!unknownUsageTracked) return;

    let userData = localStorage.getItem(SHARED_PREFS_UNKNOWN_SESSIONS);

    // If no session data exists, create it first
    if (!userData) {
      this.updateUnknownSession();
      userData = localStorage.getItem(SHARED_PREFS_UNKNOWN_SESSIONS);
    }

    const strUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );
    const dataFields = strUserUpdate ? JSON.parse(strUserUpdate) : {};

    delete dataFields[SHARED_PREFS_EVENT_TYPE];

    const userId = uuidv4();

    if (userData) {
      const userSessionInfo = JSON.parse(userData);
      const userDataJson = userSessionInfo[SHARED_PREFS_UNKNOWN_SESSIONS] || {};
      const payload: TrackUnknownSessionParams = {
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
        unknownSessionContext: {
          totalUnknownSessionCount: userDataJson.number_of_sessions || 0,
          lastUnknownSession:
            userDataJson.last_session || this.getCurrentTime(),
          firstUnknownSession:
            userDataJson.first_session || this.getCurrentTime(),
          matchedCriteriaId: parseInt(criteriaId, 10)
        }
      };
      const response = await baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINT_TRACK_UNKNOWN_SESSION,
        data: payload
      }).catch((e) => {
        console.log('[DEBUG] Request failed:', e);
        if (e?.response?.status === 409) {
          this.getUnknownCriteria();
        }
      });
      if (response?.status === 200) {
        localStorage.removeItem(SHARED_PREFS_USER_UPDATE_OBJECT_KEY);

        const onUnknownUserCreated = config.getConfig('onUnknownUserCreated');

        if (onUnknownUserCreated) {
          onUnknownUserCreated(userId);
        }
        if (unknownUserIdSetter !== null) {
          await unknownUserIdSetter(userId);
        }
        await this.handleConsentTracking(false);
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
          this.removeUnknownSessionCriteriaData();
        }
      );
    }

    if (Object.keys(userUpdateObject).length) {
      // eslint-disable-next-line no-param-reassign
      delete userUpdateObject[SHARED_PREFS_EVENT_TYPE];
      this.updateUser(userUpdateObject);
    }
  }

  async handleConsentTracking(
    isUserKnown?: boolean,
    isMergeOperation?: boolean
  ) {
    // Track consent only in specific scenarios:
    // 1. Unknown user created (isUserKnown: false) - after /session call
    // 2. User signs up after tracking locally but /session was never called
    // Skip consent tracking if this is a merge operation
    if (this.hasConsent() && !isMergeOperation) {
      const identityResolutionConfig = config.getConfig('identityResolution');
      const replayEnabled = identityResolutionConfig?.replayOnVisitorToKnown;

      if (replayEnabled) {
        try {
          if (isUserKnown === true) {
            const unknownUserCreated = localStorage.getItem(
              SHARED_PREF_UNKNOWN_USER_ID
            );
            if (!unknownUserCreated) {
              await this.trackConsent(true);
            }
          } else {
            await this.trackConsent(false);
          }
        } catch (error) {
          console.warn(
            'Consent tracking failed, continuing with event replay:',
            error
          );
        }
      }
    }
  }

  removeUnknownSessionCriteriaData() {
    localStorage.removeItem(SHARED_PREFS_UNKNOWN_SESSIONS);
    localStorage.removeItem(SHARED_PREFS_EVENT_LIST_KEY);
    localStorage.removeItem(SHARED_PREFS_USER_UPDATE_OBJECT_KEY);
  }

  private async storeEventListToLocalStorage(newDataObject: UnknownEventData) {
    const unknownUsageTracked = isUnknownUsageTracked();

    if (!unknownUsageTracked) return;

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
      this.createUnknownUser(criteriaId);
    }
  }

  private async storeUserUpdateToLocalStorage(
    newDataObject: UnknownUserUpdateData
  ) {
    const unknownUsageTracked = isUnknownUsageTracked();

    if (!unknownUsageTracked) return;

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
      this.createUnknownUser(criteriaId);
    }
  }

  private getCurrentTime = () => {
    const dateInMillis = new Date().getTime();
    const dateInSeconds = Math.floor(dateInMillis / 1000);
    return dateInSeconds;
  };

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

  // Consent tracking methods
  getConsentTimestamp(): string | null {
    return localStorage.getItem(SHARED_PREF_CONSENT_TIMESTAMP);
  }

  hasConsent(): boolean {
    return this.getConsentTimestamp() !== null;
  }

  private getCurrentUserInfo(): { email?: string; userId?: string } {
    const typeOfAuth = getTypeOfAuth();

    // First priority: actual user credentials from login/signup
    if (typeOfAuth === 'email') {
      const email = localStorage.getItem(SHARED_PREF_EMAIL);
      if (email) {
        return { email };
      }
    }

    if (typeOfAuth === 'userID') {
      const userId = localStorage.getItem(SHARED_PREF_USER_ID);
      if (userId) {
        return { userId };
      }
    }

    // Fallback: generated unknown user ID (for scenario 1: after /session call)
    const unknownUserId = localStorage.getItem(SHARED_PREF_UNKNOWN_USER_ID);
    if (unknownUserId) {
      return { userId: unknownUserId };
    }

    return {};
  }

  async trackConsent(isUserKnown: boolean): Promise<any> {
    const consentTimestamp = this.getConsentTimestamp();
    if (!consentTimestamp) return null;

    const userInfo = this.getCurrentUserInfo();
    const payload: ConsentRequestParams = {
      consentTimestamp: parseInt(consentTimestamp, 10),
      isUserKnown,
      deviceInfo: {
        appPackageName: window.location.hostname,
        deviceId: global.navigator.userAgent || '',
        platform: WEB_PLATFORM
      },
      ...userInfo
    };

    try {
      const response = await baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINT_UNKNOWN_USER_CONSENT,
        data: payload,
        validation: {
          data: consentRequestSchema
        }
      });

      // Remove consent timestamp after successful call
      localStorage.removeItem(SHARED_PREF_CONSENT_TIMESTAMP);

      return response;
    } catch (error) {
      // Don't block event replay if consent call fails
      console.warn('Failed to track consent:', error);
      return null;
    }
  }
}
