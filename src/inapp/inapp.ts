import { InAppMessagesRequestParams, InAppMessageResponse } from './types';
import { baseRequest } from '../request';
import { IterablePromise } from '../types';

export const getInAppMessages = (
  payload: InAppMessagesRequestParams
): IterablePromise<InAppMessageResponse> => {
  return baseRequest({
    method: 'GET',
    url: '/inApp/getMessages',
    params: payload
  });
};
