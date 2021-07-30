import { IterableResponse } from '../types';
import { baseIterableRequest } from '../request';
import { UpdateUserParams } from './types';

export const updateUserEmail = (newEmail: string) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/users/updateEmail',
    data: {
      newEmail
    }
  });
};

export const updateUser = (payload: UpdateUserParams) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: '/users/update',
    data: {
      ...payload,
      preferUserId: true
    }
  });
