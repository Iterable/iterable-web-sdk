import { object, string } from 'yup';
import { IterableResponse } from '../types';
import { baseIterableRequest } from '../request';
import { UpdateSubscriptionParams, UpdateUserParams } from './types';
import { updateSubscriptionsSchema, updateUserSchema } from './users.schema';
import { AnonymousUserEventManager } from '../anonymousUserTracking/anonymousUserEventManager';
import { canTrackAnonUser } from 'src/utils/commonFunctions';
import { ANON_USER_ERROR, ENDPOINTS } from 'src/constants';

export const updateUserEmail = (newEmail: string) => {
  return baseIterableRequest<IterableResponse>({
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
};

export const updateUser = (payload: UpdateUserParams = {}) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  if (payload.dataFields) {
    if (canTrackAnonUser()) {
      const anonymousUserEventManager = new AnonymousUserEventManager();
      anonymousUserEventManager.trackAnonUpdateUser(payload);
      return Promise.reject(ANON_USER_ERROR);
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
  }
};

export const updateSubscriptions = (
  payload: Partial<UpdateSubscriptionParams> = {}
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
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
