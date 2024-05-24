import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
import { updateCartSchema, trackPurchaseSchema } from './commerce.schema';
import { AnonymousUserEventManager } from '../utils/anonymousUserEventManager';
import config from '../utils/config';
import {
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID,
  ENDPOINTS
} from 'src/constants';

const canTrackAnonUser = (payload: any): boolean => {
  if (
    (!(SHARED_PREF_USER_ID in (payload.user ?? {})) ||
      payload.user?.userId === null ||
      typeof payload.user?.userId === 'undefined') &&
    (!(SHARED_PREF_EMAIL in (payload.user ?? {})) ||
      payload.user?.email === null ||
      typeof payload.user?.email === 'undefined') &&
    config.getConfig('enableAnonTracking')
  ) {
    return true;
  }
  return false;
};
export const updateCart = (payload: UpdateCartRequestParams) => {
  if (canTrackAnonUser(payload)) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonUpdateCart(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
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
  if (canTrackAnonUser(payload)) {
    console.log('inside trackPurchase Anon');
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonPurchaseEvent(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
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
