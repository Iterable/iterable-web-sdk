import { ENDPOINT_MERGE_USER, MERGE_SUCCESSFULL } from 'src/constants';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';

export type MergeApiParams = {
  sourceEmail: string | null;
  sourceUserId: string | null;
  destinationEmail: string | null;
  destinationUserId: string | null;
};

export class AnonymousUserMerge {
  mergeUser(
    sourceUserId: string | null,
    sourceEmail: string | null,
    destinationUserId: string | null,
    destinationEmail: string | null
  ): Promise<string> {
    const mergeApiParams: MergeApiParams = {
      sourceUserId: sourceUserId,
      sourceEmail: sourceEmail,
      destinationUserId: destinationUserId,
      destinationEmail: destinationEmail
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
