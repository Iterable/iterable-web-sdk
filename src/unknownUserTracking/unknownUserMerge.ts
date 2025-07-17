/* eslint-disable class-methods-use-this */
import { ENDPOINT_MERGE_USER } from '../constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';

export type MergeApiParams = {
  sourceEmail: string | null;
  sourceUserId: string | null;
  destinationEmail: string | null;
  destinationUserId: string | null;
};

export class UnknownUserMerge {
  mergeUser(
    sourceUserId: string | null,
    sourceEmail: string | null,
    destinationUserId: string | null,
    destinationEmail: string | null
  ): Promise<void> {
    const mergeApiParams: MergeApiParams = {
      sourceUserId,
      sourceEmail,
      destinationUserId,
      destinationEmail
    };
    return this.callMergeApi(mergeApiParams);
  }

  private callMergeApi(data: MergeApiParams): Promise<void> {
    return new Promise((resolve, reject) => {
      baseIterableRequest<IterableResponse>({
        method: 'POST',
        url: ENDPOINT_MERGE_USER,
        data
      })
        .then((response) => {
          if (response.status === 200) {
            resolve();
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
