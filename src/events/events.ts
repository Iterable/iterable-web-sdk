import { baseIterableRequest } from '../request';
import { InAppTrackRequestParams } from './in-app/types';
import { IterableResponse } from '../types';
import { trackSchema } from './events.schema';
import { END_POINTS } from 'src/constants';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: END_POINTS.event_track.route,
    data: payload,
    validation: {
      data: trackSchema
    }
  });
};
