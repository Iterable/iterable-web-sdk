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

export class AnonymousUserMerge {
  private anonymousUserManager = new AnonymousUserEventManager();

  mergeUserUsingUserId(destinationUserId: string): void {
    const sourceUserId = localStorage.getItem(SHARED_PREF_USER_ID);
    if (
      !sourceUserId ||
      sourceUserId === '' ||
      sourceUserId === destinationUserId
    ) {
      return;
    }
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_USERID,
      params: { userId: destinationUserId }
    })
      .then((response) => {
        const userData: any = response.data;
        if (userData) {
          if (userData.user) {
            this.callMergeApi(
              '',
              sourceUserId,
              localStorage.getItem(SHARED_PREF_EMAIL) || '',
              destinationUserId
            );
          }
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }

  mergeUserUsingEmail(destinationEmail: string): void {
    const sourceEmail = localStorage.getItem(SHARED_PREF_EMAIL);
    if (
      !sourceEmail ||
      sourceEmail === '' ||
      sourceEmail === destinationEmail
    ) {
      return;
    }
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_EMAIL,
      params: { email: destinationEmail },
      validation: {}
    })
      .then((response) => {
        const userData: any = response.data;
        if (userData) {
          if (userData.user) {
            this.callMergeApi(
              destinationEmail,
              '',
              destinationEmail,
              localStorage.getItem(SHARED_PREF_USER_ID) || ''
            );
          }
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }

  private callMergeApi(
    sourceEmail: string,
    sourceUserId: string,
    destinationEmail: string,
    destinationUserId: string
  ): void {
    baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: ENDPOINT_MERGE_USER,
      data: {
        sourceEmail: sourceEmail !== '' ? sourceEmail : undefined,
        sourceUserId: sourceUserId !== '' ? sourceUserId : undefined,
        destinationEmail:
          destinationEmail !== '' ? destinationEmail : undefined,
        destinationUserId:
          destinationUserId !== '' ? destinationUserId : undefined
      }
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
