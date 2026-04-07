import { baseIterableRequest } from '../../request';
import { InAppEventRequestParams } from './types';
import { IterableResponse } from '../../types';
import { ENDPOINTS, WEB_PLATFORM } from '../../constants';
import { eventRequestSchema } from './events.schema';

export const trackInAppClose = (payload: InAppEventRequestParams) => {
  /* strip email/userId without mutating the caller's object;
     the interceptor adds the correct identity from SDK state */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { email, userId, ...rest } = payload as any;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_close.route,
    data: {
      ...rest,
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
};

export const trackInAppOpen = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'inboxSessionId' | 'closeAction'
  >
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { email, userId, ...rest } = payload as any;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_open.route,
    data: {
      ...rest,
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
};

export const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>,
  sendBeacon = false
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { email, userId, ...rest } = payload as any;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_click.route,
    sendBeacon,
    data: {
      ...rest,
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
};

export const trackInAppDelivery = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { email, userId, ...rest } = payload as any;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_delivery.route,
    data: {
      ...rest,
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
};

export const trackInAppConsume = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { email, userId, ...rest } = payload as any;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.track_app_consume.route,
    data: {
      ...rest,
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
};
