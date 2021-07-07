import { AxiosPromise } from 'axios';
import { baseRequest } from '../request';
import { GetUserResponse } from './types';

/* 
  if the user identified the user with the _setEmail_ method, 
  {email} will be replaced with the set email.
*/
export const getUserByEmail = (
  email = '{email}'
): AxiosPromise<GetUserResponse> =>
  baseRequest({
    method: 'GET',
    url: `/api/users/${email}`
  });

/* userId param optional due to the ability to handle this through the _setUserID_ method */
export const getUserByID = (userId?: string): AxiosPromise<GetUserResponse> =>
  baseRequest({
    method: 'GET',
    url: `/api/users/byUserId`,
    params: !!userId
      ? {
          userId
        }
      : {}
  });
