import { baseIterableRequest } from '../request';
import { InAppTrackRequestParams } from './in-app/types';
import {
  EmbeddedMessagingDismiss,
  EmbeddedMessagingSession,
  EmbeddedTrackClick,
  IEmbeddedMessage,
  IEmbeddedSession
} from './embedded/types';
import { IterableResponse } from '../types';
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
    url: EndPoints.msg_received_event_track,
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

export const trackEmbeddedClick = (payload: EmbeddedTrackClick) => {
  const data: any = {
    messageId: payload.messageId,
    buttonIdentifier: payload.buttonIdentifier,
    targetUrl: payload.clickedUrl,
    deviceInfo: {
      platform: WEB_PLATFORM,
      deviceId: global.navigator.userAgent || '',
      appPackageName: payload.appPackageName || window.location.hostname
    },
    createdAt: Date.now()
  };

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_click_event_track,
    data,
    validation: {
      data: trackEmbeddedMessageClickSchema
    }
  }).catch((error) => {
    if (payload.errorCallback) {
      payload.errorCallback({
        ...error?.response?.data,
        statusCode: error?.response?.status
      });
    }
    return error;
  });
};

export const trackEmbeddedSession = (payload: IEmbeddedSession) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_impression_event_track,
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
