import { object, string } from 'yup';
import { IterableResponse } from '../types';
import { baseIterableRequest } from '../request';
import { UpdateSubscriptionParams, UpdateUserParams } from './types';
import { updateSubscriptionsSchema, updateUserSchema } from './users.schema';
import { AnonymousUserEventManager } from '..';
import config from '../utils/config';

export const updateUserEmail = (newEmail: string) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/users/updateEmail',
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
  if (
    (!('userId' in payload) ||
      payload.userId === null ||
      typeof payload.userId === 'undefined') &&
    (!('email' in payload) ||
      payload.email === null ||
      typeof payload.email === 'undefined') &&
    config.getConfig('enableAnonTracking')
  ) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonUpdateUser(payload);
    const errorMessage =
      'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
    throw new Error(errorMessage);
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/users/update',
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
  payload: Partial<UpdateSubscriptionParams> = {}
) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/users/updateSubscriptions',
    data: payload,
    validation: {
      data: updateSubscriptionsSchema
    }
  });
};
