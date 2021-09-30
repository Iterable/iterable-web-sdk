import { object, string } from 'yup';
import { IterableResponse } from '../types';
import { baseIterableRequest } from '../request';
import { UpdateSubscriptionParams, UpdateUserParams } from './types';
import { updateSubscriptionsSchema, updateUserSchema } from './users.schema';

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
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;

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
