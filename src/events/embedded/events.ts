import { baseIterableRequest } from '../../request';
import {
  IterableEmbeddedDismissRequestPayload,
  IterableEmbeddedSessionRequestPayload,
  IterableEmbeddedClickRequestPayload
} from './types';
import { IterableResponse } from '../../types';
import {
  trackEmbeddedSchema,
  trackEmbeddedClickSchema,
  embeddedDismissSchema,
  embeddedSessionSchema
} from './events.schema';
import { EndPoints } from '../consts';
import { WEB_PLATFORM } from 'src/constants';

export const trackEmbeddedReceived = (
  messageId: string,
  appPackageName: string
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_received_event_track,
    data: {
      messageId,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      }
    },
    validation: {
      data: trackEmbeddedSchema
    }
  });

export const trackEmbeddedClick = (
  payload: IterableEmbeddedClickRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_click_event_track,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: trackEmbeddedClickSchema
    }
  });
};

export const trackEmbeddedDismiss = (
  payload: IterableEmbeddedDismissRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_dismiss,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: embeddedDismissSchema
    }
  });
};

export const trackEmbeddedSession = (
  payload: IterableEmbeddedSessionRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_session_event_track,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: embeddedSessionSchema
    }
  });
};
