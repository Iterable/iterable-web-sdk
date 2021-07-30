import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';

export const updateCart = (payload: UpdateCartRequestParams) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/commerce/updateCart',
    data: {
      ...payload,
      user: {
        ...payload.user,
        preferUserId: true
      }
    }
  });
};

export const trackPurchase = (payload: TrackPurchaseRequestParams) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/commerce/trackPurchase',
    data: {
      ...payload,
      user: {
        ...payload.user,
        preferUserId: true
      }
    }
  });
};
