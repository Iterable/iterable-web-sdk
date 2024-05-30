import {
  SHARED_PREF_ANON_USER_ID,
  ENDPOINT_MERGE_USER,
  MERGE_SUCCESSFULL
} from 'src/constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';

export type MergeApiParams = {
  sourceEmail: string | null;
  sourceUserId: string | null;
  destinationEmail: string | null;
  destinationUserId: string | null;
};

export class AnonymousUserMerge {
  mergeUser(userIdOrEmail: string, isEmail: boolean): Promise<string> {
    const sourceUserId = localStorage.getItem(SHARED_PREF_ANON_USER_ID);

    const mergeApiParams: MergeApiParams = {
      sourceUserId: isEmail ? null : sourceUserId,
      sourceEmail: isEmail ? sourceUserId : null,
      destinationUserId: isEmail ? null : userIdOrEmail,
      destinationEmail: isEmail ? userIdOrEmail : null
    };
    return this.callMergeApi(mergeApiParams);
  }

  private callMergeApi(data: MergeApiParams): Promise<string> {
    return new Promise((resolve, reject) => {
      baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINT_MERGE_USER,
        data
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(MERGE_SUCCESSFULL);
          } else {
            reject(new Error(`merge error: ${response.status}`)); // Reject if status is not 200
          }
        })
        .catch((e) => {
          reject(e); // Reject the promise if the request fails
        });
    });
  }
}
