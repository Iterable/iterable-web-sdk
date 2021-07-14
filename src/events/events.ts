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

export const trackInAppDelivery = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppDelivery',
    data: payload
  });
};

export const trackInAppConsume = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/inAppConsume',
    data: payload
  });
};
