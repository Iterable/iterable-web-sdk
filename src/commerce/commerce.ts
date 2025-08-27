/* eslint-disable no-param-reassign */
import { ENDPOINTS, AUA_WARNING } from '../constants';
import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
import { updateCartSchema, trackPurchaseSchema } from './commerce.schema';
import { UnknownUserEventManager } from '../unknownUserTracking/unknownUserEventManager';
import { canTrackUnknownUser } from '../utils/commonFunctions';

export const updateCart = (payload: UpdateCartRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  if (payload.user) {
    delete (payload as any).user.userId;
    delete (payload as any).user.email;
  }
  if (canTrackUnknownUser()) {
    const unknownUserEventManager = new UnknownUserEventManager();
    unknownUserEventManager.trackUnknownUpdateCart(payload);
    return Promise.reject(AUA_WARNING);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.commerce_update_cart.route,
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
  /* a customer could potentially send these up if they're not using TypeScript */
  if (payload.user) {
    delete (payload as any).user.userId;
    delete (payload as any).user.email;
  }
  if (canTrackUnknownUser()) {
    const unknownUserEventManager = new UnknownUserEventManager();
    unknownUserEventManager.trackUnknownPurchaseEvent(payload);
    return Promise.reject(AUA_WARNING);
  }

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.commerce_track_purchase.route,
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
