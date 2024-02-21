import {
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID,
  ENDPOINT_GET_USER_BY_USERID,
  ENDPOINT_GET_USER_BY_EMAIL,
  ENDPOINT_MERGE_USER
} from 'src/constants';
import { AnonymousUserEventManager } from './anonymousUserEventManager';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import { isEmail } from 'src/authorization/utils';

type MergeApiParams = {
  sourceEmail: string | null;
  sourceUserId: string | null;
  destinationEmail: string | null;
  destinationUserId: string | null;
}

export class AnonymousUserMerge {
  private anonymousUserManager = new AnonymousUserEventManager();

  mergeUser(user: string): void {
    const userContainsEmail = isEmail(user)
    const sourceUser = localStorage.getItem(userContainsEmail ? SHARED_PREF_EMAIL : SHARED_PREF_USER_ID)

    const mergeApiParams: MergeApiParams = {
      sourceUserId: !userContainsEmail ? localStorage.getItem(SHARED_PREF_USER_ID) : null,
      sourceEmail: userContainsEmail ? localStorage.getItem(SHARED_PREF_EMAIL) : null,
      destinationUserId: !userContainsEmail ? user : null,
      destinationEmail: userContainsEmail ? user : null,
    }
    
    if (!user || user === sourceUser) {
      return;
    }
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: userContainsEmail ? ENDPOINT_GET_USER_BY_EMAIL : ENDPOINT_GET_USER_BY_USERID,
      params: { email: mergeApiParams.destinationEmail, userId: mergeApiParams.destinationUserId},
    })
      .then((response) => {
        const userData: any = response.data;
        if (userData) {
          if (userData.user) {
            this.callMergeApi(mergeApiParams);
          }
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }

  private callMergeApi(data: MergeApiParams): void {
    baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: ENDPOINT_MERGE_USER,
      data,
    })
      .then((response) => {
        if (response.status === 200) {
          try {
            this.anonymousUserManager.syncEvents();
          } catch (error) {
            console.error('error', error);
          }
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }
}
