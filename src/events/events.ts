import { baseIterableRequest } from '../request';
import { InAppEventRequestParams, InAppTrackRequestParams } from './types';
import { IterableResponse } from '../types';
import { WEB_PLATFORM } from '../constants';
import { eventRequestSchema, trackSchema } from './events.schema';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  // delete (payload as any).userId;
  // delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/track',
    data: payload,
    validation: {
      data: trackSchema
    },
    headers: {
      'Api-Key': payload?.headers ? payload?.headers['Api-Key'] : ''
    }
  });
};

export const trackInAppClose = (payload: InAppEventRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppClose',
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
};

export const trackInAppOpen = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'inboxSessionId' | 'closeAction'
  >
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppOpen',
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
};

export const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>,
  sendBeacon = false
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppClick',
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
};

export const trackInAppDelivery = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/trackInAppDelivery',
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
};

export const trackInAppConsume = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/inAppConsume',
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
};
