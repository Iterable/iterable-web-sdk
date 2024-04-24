import { baseIterableRequest } from '../request';
import {
  InAppTrackRequestParams,
  IEmbeddedMessage,
  IEventEmbeddedSession
} from './in-app/types';
import { IterableResponse, IEmbeddedMessageMetadata } from '../types';
import { WEB_PLATFORM } from '../constants';
import {
  trackSchema,
  trackEmbeddedMessageSchema,
  trackEmbeddedMessageClickSchema,
  trackEmbeddedSessionSchema,
  embaddedMessagingDismissSchema,
  embaddedMessagingSessionSchema
} from './events.schema';
import { EndPoints } from './consts';

import {
  EmbeddedMessagingDismiss,
  EmbeddedMessagingSession
} from '../../src/types';
import { functions } from 'src/utils/functions';

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
  appPackageName: string,
  createdAt: number,
  userIdOrEmail: string
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/embedded-messaging/events/click',
    data: {
      [functions.checkEmailValidation(userIdOrEmail) ? 'email' : 'userId']:
        userIdOrEmail,
      messageId: payload.messageId,
      buttonIdentifier: buttonIdentifier,
      targetUrl: clickedUrl,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName: appPackageName
      },
      createdAt: createdAt
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

export const trackEmbeddedMessagingDismiss = (
  payload: EmbeddedMessagingDismiss
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_dismiss,
    data: payload,
    validation: {
      data: embaddedMessagingDismissSchema
    }
  });
};

export const trackEmbeddedMessagingSession = (
  payload: EmbeddedMessagingSession
) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_session_event_track,
    data: payload,
    validation: {
      data: embaddedMessagingSessionSchema
    }
  });
};
