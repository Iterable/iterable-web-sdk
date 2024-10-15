/* eslint-disable no-param-reassign */
import { INITIALIZE_ERROR, ENDPOINTS } from '../constants';
import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
import { updateCartSchema, trackPurchaseSchema } from './commerce.schema';
import { AnonymousUserEventManager } from '../anonymousUserTracking/anonymousUserEventManager';
import { canTrackAnonUser } from '../utils/commonFunctions';
import { typeOfAuth } from '../authorization';

export const updateCart = (payload: UpdateCartRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  if (payload.user) {
    delete (payload as any).user.userId;
    delete (payload as any).user.email;
  }
  if (canTrackAnonUser()) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonUpdateCart(payload);
    return Promise.reject(INITIALIZE_ERROR);
  }

  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
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
  if (canTrackAnonUser()) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonPurchaseEvent(payload);
    return Promise.reject(INITIALIZE_ERROR);
  }

  if (typeOfAuth === null) {
    return Promise.reject(INITIALIZE_ERROR);
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
