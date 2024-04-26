import { baseIterableRequest } from '../request';
import {
  InAppTrackRequestParams,
  IEmbeddedMessage,
  IEventEmbeddedSession
} from './in-app/types';
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

import { EnbeddedMessagingDismiss, EnbeddedMessagingSession } from './types';
import { functions } from 'src/utils/functions';
import { EmbeddedTrackClick } from './embedded/types';

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
  let data: any = {
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
  data = functions.addEmailOrUserIdToJson(data, localStorage);

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_click_event_track,
    data,
    validation: {
      data: trackEmbeddedMessageClickSchema
    }
  });
};

export const trackEmbeddedSession = (payload: IEventEmbeddedSession) => {
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
  payload: EnbeddedMessagingDismiss
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
  payload: EnbeddedMessagingSession
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
