import { WEB_PLATFORM, ENDPOINTS, INITIALIZE_ERROR } from '../../constants';
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
import { typeOfAuth } from '../../authorization';

export const trackEmbeddedReceived = (
  messageId: string,
  appPackageName: string
) => {
  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_received_event_track.route,
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
};

export const trackEmbeddedClick = (
  payload: IterableEmbeddedClickRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_click_event_track.route,
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

  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_dismiss.route,
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

  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_session_event_track.route,
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
