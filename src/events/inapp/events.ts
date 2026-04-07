import { baseIterableRequest } from '../../request';
import { InAppEventRequestParams } from './types';
import { IterableResponse } from '../../types';
import { ENDPOINTS, WEB_PLATFORM } from '../../constants';
import { eventRequestSchema } from './events.schema';

export const trackInAppClose = (payload: InAppEventRequestParams) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_close.route,
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: eventRequestSchema
    }
  });

export const trackInAppOpen = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'inboxSessionId' | 'closeAction'
  >
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_open.route,
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: eventRequestSchema.omit([
        'clickedUrl',
        'inboxSessionId',
        'closeAction'
      ])
    }
  });

export const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>,
  sendBeacon = false
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_click.route,
    sendBeacon,
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: eventRequestSchema.omit(['inboxSessionId', 'closeAction'])
    }
  });

export const trackInAppDelivery = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_delivery.route,
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: eventRequestSchema.omit([
        'clickedUrl',
        'inboxSessionId',
        'closeAction'
      ])
    }
  });

export const trackInAppConsume = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_consume.route,
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: eventRequestSchema.omit([
        'clickedUrl',
        'inboxSessionId',
        'closeAction'
      ])
    }
  });
