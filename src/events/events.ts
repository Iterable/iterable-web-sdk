import { baseIterableRequest } from '../request';
import { InAppEventRequestParams, InAppTrackRequestParams } from './types';
import { IterableResponse } from '../types';
import { WEB_PLATFORM } from '../constants';
import { eventRequestSchema, trackSchema } from './events.schema';
import { AnonymousUserEventManager } from './anonymousUserEventManager';

export const track = (payload: InAppTrackRequestParams) => {
  if (
    (!('userId' in payload) || payload.userId === null) &&
    (!('email' in payload) || payload.email === null)
  ) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonEvent(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/events/track',
    data: payload,
    validation: {
      data: trackSchema
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
  // delete (payload as any).userId;
  // delete (payload as any).email;

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
