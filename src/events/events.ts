import { baseIterableRequest } from '../request';
import { InAppTrackRequestParams } from './in-app/types';
import { IterableResponse } from '../types';
import { AnonymousUserEventManager } from '../utils/anonymousUserEventManager';
import { canTrackAnonUser } from 'src/utils/commonFunctions';
import { trackSchema } from './events.schema';
import { ENDPOINTS } from 'src/constants';

export const track = (payload: InAppTrackRequestParams) => {
  if (canTrackAnonUser(payload)) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonEvent(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.event_track.route,
    data: payload,
    validation: {
      data: trackSchema
    }
  });
};
