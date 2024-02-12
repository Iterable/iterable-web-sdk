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
      console.log('sourceUserId is null or same as destinationUserId');
      return;
    }
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_USERID,
      data: { userId: destinationUserId },
      validation: {}
    })
      .then((response) => {
        const userData: any = response.data;
        if (userData) {
          const dataObj = JSON.parse(userData);
          if (dataObj.user) {
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
      console.log('sourceEmail is null or same as destinationEmail');
      return;
    }
    baseIterableRequest<IterableResponse>({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_EMAIL,
      data: { email: destinationEmail },
      validation: {}
    })
      .then((response) => {
        const userData: any = response.data;
        if (userData) {
          const dataObj = JSON.parse(userData);
          if (dataObj.user) {
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
        sourceEmail: sourceEmail,
        sourceUserId: sourceUserId,
        destinationEmail: destinationEmail,
        destinationUserId: destinationUserId
      },
      validation: {}
    })
      .then((response) => {
        if (response.statusText === 'success') {
          this.anonymousUserManager.syncEvents();
        }
      })
      .catch((e) => {
        console.log('response', e);
      });
  }
}
