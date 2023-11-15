import { baseIterableRequest } from '../request';
import {
  InAppTrackRequestParams,
  IEmbeddedMessage,
  IEmbeddedMessageMetadata,
  IEventEmbeddedSession
} from './in-app/types';
import { IterableResponse } from '../types';
import { WEB_PLATFORM } from '../constants';
import {
  trackSchema,
  trackEmbeddedMessageSchema,
  trackEmbeddedMessageClickSchema,
  trackEmbeddedSessionSchema
} from './events.schema';
import { EndPoints } from './consts';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.event_track,
    data: payload,
    validation: {
      data: trackSchema
    }
  });
};

export const trackEmbeddedMessageReceived = (payload: IEmbeddedMessage) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/embedded-messaging/events/received',
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: trackEmbeddedMessageSchema
    }
  });
};

export const trackEmbeddedMessageClick = (
  payload: IEmbeddedMessageMetadata,
  buttonIdentifier: string,
  clickedUrl: string,
  appPackageName: string
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/embedded-messaging/events/click',
    data: {
      messageId: payload.messageId,
      buttonIdentifier: buttonIdentifier,
      targetUrl: clickedUrl,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName: appPackageName
      }
    },
    validation: {
      data: trackEmbeddedMessageClickSchema
    }
  });
};

export const trackEmbeddedSession = (payload: IEventEmbeddedSession) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/embedded-messaging/events/impression',
    data: {
      ...payload,
      deviceInfo: {
        ...payload.deviceInfo,
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || ''
      }
    },
    validation: {
      data: trackEmbeddedSessionSchema
    }
  });
};
