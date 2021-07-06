import { AxiosPromise } from 'axios';
import { InAppMessagesRequestParams, InAppMessageResponse } from './types';
import { baseRequest } from '../request';

export const getInAppMessages = (
  payload: InAppMessagesRequestParams
): AxiosPromise<InAppMessageResponse> => {
  return baseRequest({
    method: 'GET',
    url: '/api/inApp/getMessages',
    params: payload
  });
};
