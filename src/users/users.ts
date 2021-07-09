import { IterablePromise, IterableResponse } from '../types';
import { baseRequest } from '../request';
import { UpdateUserParams } from './types';

export const updateUserEmail = (
  newEmail: string
): IterablePromise<IterableResponse> => {
  return baseRequest({
    method: 'POST',
    url: '/users/updateEmail',
    data: {
      newEmail
    }
  });
};

export const updateUser = (
  payload: UpdateUserParams
): IterablePromise<IterableResponse> =>
  baseRequest({
    method: 'POST',
    url: '/users/update',
    data: payload
  });
