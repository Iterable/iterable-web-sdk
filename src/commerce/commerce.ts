import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
import { updateCartSchema, trackPurchaseSchema } from './commerce.schema';
import { AnonymousUserEventManager } from '..';

export const updateCart = (payload: UpdateCartRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  // if (payload.user) {
  //   delete (payload as any).user.userId;
  //   delete (payload as any).user.email;
  // }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/commerce/updateCart',
    data: {
      ...payload,
      user: {
        ...payload.user,
        preferUserId: true
      }
    },
    validation: {
      data: updateCartSchema
    }
  });
};

export const trackPurchase = (payload: TrackPurchaseRequestParams) => {
  if (
    (!('userId' in payload) || payload.userId === null) &&
    (!('email' in payload) || payload.email === null)
  ) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonPurchaseEvent(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/commerce/trackPurchase',
    data: {
      ...payload,
      user: {
        ...payload.user,
        preferUserId: true
      }
    },
    validation: {
      data: trackPurchaseSchema
    }
  });
};
