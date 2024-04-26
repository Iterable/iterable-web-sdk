import { baseIterableRequest } from '../../request';
import {
  IEmbeddedMessage,
  IEmbeddedSession,
  EnbeddedMessagingDismiss,
  EnbeddedMessagingSession
} from './types';
import { IterableResponse } from '../../types';
import {
  trackEmbeddedMessageSchema,
  trackEmbeddedSessionSchema,
  embaddedMessagingDismissSchema,
  embaddedMessagingSessionSchema
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
