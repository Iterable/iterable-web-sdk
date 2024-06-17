import { baseIterableRequest } from 'src/request';
import { IterableResponse } from 'src/types';
import { AnonymousUserEventManager } from 'src/utils/anonymousUserEventManager';
import { canTrackAnonUser } from 'src/utils/commonFunctions';
import { InAppTrackRequestParams } from './in-app/types';
import { trackSchema } from './events.schema';
import { ENDPOINTS } from 'src/constants';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;
  if (canTrackAnonUser()) {
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
