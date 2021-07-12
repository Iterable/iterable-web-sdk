import { baseRequest } from '../request';
import { InAppEventRequestParams } from './types';
import { IterablePromise, IterableResponse } from '../types';

export const trackInAppClose = (
  payload: InAppEventRequestParams
): IterablePromise<IterableResponse> => {
  return baseRequest({
    method: 'POST',
    url: '/events/trackInAppClose',
    data: payload
  });
};

export const trackInAppOpen = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'inboxSessionId' | 'closeAction'
  >
): IterablePromise<IterableResponse> => {
  return baseRequest({
    method: 'POST',
    url: '/events/trackInAppOpen',
    data: payload
  });
};

export const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>
): IterablePromise<IterableResponse> => {
  return baseRequest({
    method: 'POST',
    url: '/events/trackInAppClick',
    data: payload
  });
};
