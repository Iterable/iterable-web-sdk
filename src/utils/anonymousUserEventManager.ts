import moment from 'moment';
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
  SHARED_PREFS_ANON_SESSIONS
} from 'src/constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import { UpdateUserParams } from '..';
import { CriteriaCompletionChecker } from './criteriaCompletionChecker';
// import { v4 as uuidv4 } from 'uuid';

export class AnonymousUserEventManager {
  private userId = '';

  constructor() {
    this.updateAnonSession();
    this.getAnonCriteria();
  }

  public async updateAnonSession() {
    try {
      const strAnonSessionInfo = localStorage.getItem(
        SHARED_PREFS_ANON_SESSIONS
      );
      let anonSessionInfo: {
        itbl_anon_sessions?: {
          number_of_sessions?: number;
          first_session?: string;
          last_session?: string;
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
        moment().toISOString();
      anonSessionInfo.itbl_anon_sessions.last_session = moment().toISOString();

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

  public async trackAnonEvent(payload: InAppTrackRequestParams) {
    const newDataObject = {
      [KEY_EVENT_NAME]: payload.eventName,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_CREATE_NEW_FIELDS]: true,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_EVENT
    };
    this.storeEventLocally(newDataObject);
  }

  public async trackAnonUpdateUser(payload: UpdateUserParams) {
    const newDataObject = {
      [DATA_REPLACE]: payload.dataFields,
      [SHARED_PREFS_EVENT_TYPE]: UPDATE_USER
    };
    this.storeEventLocally(newDataObject);
  }

  public async trackAnonPurchaseEvent(payload: TrackPurchaseRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [KEY_CREATED_AT]: this.getCurrentTime(),
      [KEY_DATA_FIELDS]: payload.dataFields,
      [KEY_TOTAL]: payload.total,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_PURCHASE
    };
    this.storeEventLocally(newDataObject);
  }

  public async trackAnonUpdateCart(payload: UpdateCartRequestParams) {
    const newDataObject = {
      [KEY_ITEMS]: payload.items,
      [SHARED_PREFS_EVENT_TYPE]: TRACK_UPDATE_CART,
      [KEY_CREATED_AT]: this.getCurrentTime()
    };
    this.storeEventLocally(newDataObject);
  }

  public getAnonCriteria() {
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: GET_CRITERIA_PATH,
      data: {},
      validation: {}
    })
      .then((response) => {
        const criteriaData: any = response.data;
        if (criteriaData) {
          localStorage.setItem(SHARED_PREFS_CRITERIA, criteriaData);
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }

  public async checkCriteriaCompletion() {
    const criteriaData = localStorage.getItem(SHARED_PREFS_CRITERIA);
    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    try {
      if (criteriaData && localStoredEventList) {
        const checker = new CriteriaCompletionChecker();
        return checker.getMatchedCriteria(criteriaData, localStoredEventList);
      }
    } catch (error) {
      console.error('checkCriteriaCompletion', error);
    }

    return null;
  }

  public async createKnownUser(criteriaId: number) {
    const userData = localStorage.getItem(SHARED_PREFS_ANON_SESSIONS);
    // updateUser({ userId: uuidv4(), preferUserId: true });

    if (userData) {
      const userSessionInfo = JSON.parse(userData);
      const userDataJson = userSessionInfo.get(SHARED_PREFS_ANON_SESSIONS);
      console.log('data', userDataJson);
    }

    // await updateUser({
    //   dataFields: {
    //     userId: userId,
    //     ...{ SHARED_PREFS_ANON_SESSIONS: { ...userSessionInfo } }
    //   },
    //   userId: userId
    // });
    // this.userId = userId;
    this.syncEvents();
  }

  public async syncEvents() {
    const strTrackEventList = localStorage.getItem('track_event_list');
    const trackEventList = strTrackEventList
      ? JSON.parse(strTrackEventList)
      : [];
    localStorage.removeItem('track_event_list');

    if (trackEventList.length) {
      for (let i = 0; i < trackEventList.length; i++) {
        if (trackEventList[i].dataFields['eventType'] === 'track') {
          trackEventList[i].userId = this.userId;
          await this.trackAnonEvent(trackEventList[i]);
        } else if (
          trackEventList[i].dataFields['eventType'] === 'trackPurchase'
        ) {
          trackEventList[i].user = {
            userId: this.userId,
            createNewFields: true
          };
          await this.trackAnonPurchaseEvent(trackEventList[i]);
        } else if (trackEventList[i].dataFields['eventType'] === 'cartUpdate') {
          trackEventList[i].user = {
            userId: this.userId,
            createNewFields: true
          };
          await this.trackAnonUpdateCart(trackEventList[i]);
        }
      }
    }
  }

  public storeEventLocally(payload: any) {
    const strTrackEventList = localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY);
    let trackEventList = [];

    if (strTrackEventList) {
      trackEventList = JSON.parse(strTrackEventList);
    }
    trackEventList.push(payload);
    localStorage.setItem(
      SHARED_PREFS_EVENT_LIST_KEY,
      JSON.stringify(trackEventList)
    );

    console.log(
      'store data',
      localStorage.getItem(SHARED_PREFS_EVENT_LIST_KEY)
    );
    // const isCriteriaCompleted = this.checkCriteriaCompletion();

    // if (await isCriteriaCompleted) {
    //   const userId = uuidv4();
    //   await App.setUserID(userId);
    //   await createUser(userId, process.env.API_KEY);
    //   setLoggedInUser({ type: 'user_update', data: userId });
    //   await syncEvents();
    // }
  }

  private getCurrentTime = () => {
    return new Date().getTime();
  };
}
