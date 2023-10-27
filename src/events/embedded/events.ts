import { baseIterableRequest } from '../../request';
import {
  IEmbeddedMessage,
  IEmbeddedMessageMetadata,
  IEmbeddedSession
} from './types';
import { IterableResponse } from '../../types';
import {
  trackEmbeddedMessageSchema,
  trackEmbeddedMessageClickSchema,
  trackEmbeddedSessionSchema
} from './events.schema';
import { EndPoints } from '../consts';

export const trackEmbeddedMessageReceived = (payload: IEmbeddedMessage) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_received_event_track,
    data: payload,
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
    url: EndPoints.msg_click_event_track,
    data: {
      messageId: payload.messageId,
      buttonIdentifier: buttonIdentifier,
      targetUrl: clickedUrl,
      deviceInfo: {
        appPackageName: appPackageName
      }
    },
    validation: {
      data: trackEmbeddedMessageClickSchema
    }
  });
};

export const trackEmbeddedSession = (payload: IEmbeddedSession) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: EndPoints.msg_impression_event_track,
    data: payload,
    validation: {
      data: trackEmbeddedSessionSchema
    }
  });
};
