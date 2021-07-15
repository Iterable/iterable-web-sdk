import { baseIterableRequest } from '../request';
import { InAppEventRequestParams } from './types';
import { IterableResponse } from '../types';

export const trackInAppClose = (payload: InAppEventRequestParams) => {
  return baseIterableRequest<IterableResponse>({
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
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppOpen',
    data: payload
  });
};

export const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppClick',
    data: payload
  });
};
