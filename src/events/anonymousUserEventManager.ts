import moment from 'moment';
import {
  UpdateCartRequestParams,
  TrackPurchaseRequestParams
} from '../commerce/types';
import { updateCart, trackPurchase } from '../commerce/commerce';
import { InAppTrackRequestParams } from './types';
import { track } from './events';
import { updateUser } from '../users/users';

export class AnonymousUserEventManager {
  private isUserLoggedIn = false;
  private userId = '';

  constructor() {
    this.updateAnonSession();
  }

  public async getAnonCriteria() {
    return [
      {
        criteriaId: 'String',
        criteriaList: [
          {
            criteriaType: 'track', //(track,trackPurchase,cartUpdate,anonSession,tokenRegistration),
            comparator: 'equal',
            name: 'browseWebsite'
          },
          {
            criteriaType: 'track', //(track,trackPurchase,cartUpdate,anonSession,tokenRegistration),
            comparator: 'equal',
            name: 'viewedLipstick',
            aggregateCount: 3 // count over 3
          }
        ]
      }
    ];
  }

  public storeEventLocally(payload: any) {
    const strTrackEventList = localStorage.getItem('track_event_list');
    let trackEventList = [];

    if (strTrackEventList) {
      trackEventList = JSON.parse(strTrackEventList);
    }
    trackEventList.push(payload);
    localStorage.setItem('track_event_list', JSON.stringify(trackEventList));
  }

  public async trackAnonEvent(payload: InAppTrackRequestParams) {
    if (this.isUserLoggedIn) {
      return track(payload);
    } else {
      // localstorage
      this.storeEventLocally(payload);
    }
  }

  public async trackAnonPurchaseEvent(payload: TrackPurchaseRequestParams) {
    if (this.isUserLoggedIn) {
      return trackPurchase(payload);
    } else {
      // localstorage
      this.storeEventLocally(payload);
    }
  }

  public async trackAnonUpdateCart(payload: UpdateCartRequestParams) {
    if (this.isUserLoggedIn) {
      return updateCart(payload);
    } else {
      // localstorage
      this.storeEventLocally(payload);
    }
  }

  public async updateAnonSession() {
    const strAnonSessionInfo = localStorage.getItem('itbl_anon_sessions');
    const anonSessionInfo = strAnonSessionInfo
      ? JSON.parse(strAnonSessionInfo)
      : {};

    if (!anonSessionInfo?.number_of_sessions)
      anonSessionInfo.number_of_sessions = 1;
    else
      anonSessionInfo.number_of_sessions =
        anonSessionInfo.number_of_sessions + 1;

    if (!anonSessionInfo?.first_session)
      anonSessionInfo.first_session = moment().toISOString();

    anonSessionInfo.last_session = moment().toISOString();

    localStorage.setItem('itbl_anon_sessions', JSON.stringify(anonSessionInfo));
  }

  public async createUser(userId: string) {
    const str = localStorage.getItem('itbl_anon_sessions');
    const userSessionInfo = str ? JSON.parse(str) : {};

    await updateUser({
      dataFields: {
        userId: userId,
        ...{ itbl_anon_sessions: { ...userSessionInfo } }
      },
      userId: userId
    });
    this.userId = userId;
  }

  public async syncEvents() {
    this.isUserLoggedIn = true;

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

  public async checkCriteriaCompletion() {
    let isCompleted = false;
    const criteriaResult: any = await this.getAnonCriteria();
    const strTrackEventList = localStorage.getItem('track_event_list');
    const trackEventList = strTrackEventList
      ? JSON.parse(strTrackEventList)
      : [];

    if (criteriaResult?.length) {
      criteriaResult?.forEach((criteria: any) => {
        if (criteria?.criteriaList?.length && trackEventList?.length) {
          criteria?.criteriaList.forEach((subcriteria: any) => {
            const countToMatch = subcriteria?.aggregateCount
              ? subcriteria.aggregateCount
              : 1;
            const matchedResults = trackEventList.filter(
              (event: any) => subcriteria.name === event.eventName
            );

            if (matchedResults?.length >= countToMatch) {
              isCompleted = true;
              return;
            }
          });
        }
      });
    }

    return isCompleted;
  }
}
