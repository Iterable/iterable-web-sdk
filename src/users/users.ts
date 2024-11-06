// eslint-disable @typescript-eslint/no-explicit-any
import { object, string } from 'yup';
import { IterableResponse } from '../types';
import { baseIterableRequest } from '../request';
import { UpdateSubscriptionParams, UpdateUserParams } from './types';
import { updateSubscriptionsSchema, updateUserSchema } from './users.schema';
import { AnonymousUserEventManager } from '../anonymousUserTracking/anonymousUserEventManager';
import { canTrackAnonUser } from '../utils/commonFunctions';
import { ENDPOINTS, AUA_WARNING_MESSAGE } from '../constants';

export const updateUserEmail = (newEmail: string) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.update_email.route,
    data: {
      newEmail
    },
    validation: {
      data: object().shape({
        newEmail: string().required()
      })
    }
  });

export const updateUser = (payloadParam: UpdateUserParams = {}) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  const payload = payloadParam;
  delete (payload as any).userId;
  delete (payload as any).email;

  if (canTrackAnonUser()) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonUpdateUser(payload);
    return Promise.reject(AUA_WARNING_MESSAGE).catch((e) => console.warn(e));
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.users_update.route,
    data: {
      ...payload,
      preferUserId: true
    },
    validation: {
      data: updateUserSchema
    }
  });
};

export const updateSubscriptions = (
  payloadParam: Partial<UpdateSubscriptionParams> = {}
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  const payload = payloadParam;
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.users_update_subscriptions.route,
    data: payload,
    validation: {
      data: updateSubscriptionsSchema
    }
  });
};
