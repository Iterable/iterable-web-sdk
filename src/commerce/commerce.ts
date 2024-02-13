import { baseIterableRequest } from '../request';
import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
import { updateCartSchema, trackPurchaseSchema } from './commerce.schema';
import { AnonymousUserEventManager } from '..';
import config from '../utils/config';

export const updateCart = (payload: UpdateCartRequestParams) => {
  if (
    (!payload.user ||
      !('userId' in payload.user) ||
      payload.user.userId === null ||
      typeof payload.user.userId === undefined) &&
    (!payload.user ||
      !('email' in payload.user) ||
      payload.user.email === null ||
      typeof payload.user.email === undefined) &&
    config.getConfig('enableAnonTracking')
  ) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonUpdateCart(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
  }
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
    (!payload.user ||
      !('userId' in payload.user) ||
      payload.user.userId === null ||
      typeof payload.user.userId === undefined) &&
    (!payload.user ||
      !('email' in payload.user) ||
      payload.user.email === null ||
      typeof payload.user.email === undefined) &&
    config.getConfig('enableAnonTracking')
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
