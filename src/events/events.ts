import { baseIterableRequest } from 'src/request';
import { IterableResponse } from 'src/types';
import { AnonymousUserEventManager } from 'src/anonymousUserTracking/anonymousUserEventManager';
import { canTrackAnonUser } from 'src/utils/commonFunctions';
import { InAppTrackRequestParams } from './in-app/types';
import { trackSchema } from './events.schema';
import { ENDPOINTS, INITIALIZE_ERROR } from 'src/constants';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;
  if (canTrackAnonUser()) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonEvent(payload);
    return Promise.reject(INITIALIZE_ERROR);
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
