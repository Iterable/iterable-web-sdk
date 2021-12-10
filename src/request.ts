import Axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL, STATIC_HEADERS } from './constants';
import { IterablePromise, IterableResponse } from './types';
import { AnySchema, ValidationError } from 'yup';
import { config } from './utils/config';

interface ExtendedRequestConfig extends AxiosRequestConfig {
  validation?: {
    data?: AnySchema;
    params?: AnySchema;
  };
}

interface ClientError extends IterableResponse {
  clientErrors: {
    error: string;
    field?: string;
  }[];
}

export const baseAxiosRequest = Axios.create({
  baseURL: BASE_URL
});

export const baseIterableRequest = <T = any>(
  payload: ExtendedRequestConfig
): IterablePromise<T> => {
  try {
    if (payload.validation?.data && payload.data) {
      payload.validation.data.validateSync(payload.data, { abortEarly: false });
    }
    if (payload.validation?.params && payload.params) {
      payload.validation.params.validateSync(payload.params, {
        abortEarly: false
      });
    }
    return baseAxiosRequest({
      ...payload,
      baseURL: config.getConfig('baseURL') || BASE_URL,
      headers: {
        ...payload.headers,
        ...STATIC_HEADERS
      }
    });
  } catch (error) {
    /* match Iterable's API error schema and add client errors as a new key */
    const newError: ClientError = {
      code: 'GenericError',
      msg: 'Client-side error',
      clientErrors: (error as any).inner?.map((eachError: ValidationError) => ({
        error: eachError.message,
        field: eachError.path
      }))
    };
    /* match Axios' Error object schema and reject */
    return Promise.reject({
      response: {
        data: newError,
        status: 400,
        statusText: '',
        headers: {},
        config: {}
      }
    });
  }
};

/*
  implemented:
  UsersApiController.updateUser
  UsersApiController.updateEmail
  InAppApiController.getMessages(email = None, userId = None, count = 0)
  EventsApiController.trackInAppOpen
  EventsApiController.trackInAppClick
  EventsApiController.trackInAppClose
  EventsApiController.inAppConsume
  EventsApiController.trackInAppDelivery
  EventsApiController.track
  CommerceApiController.trackPurchase
  CommerceApiController.updateCart
  UsersApiController.updateSubscriptions
  
  todo:
  UsersApiController.disableDevice
  UsersApiController.registerDeviceToken
  EventsApiController.trackPushOpen
  EventsApiController.trackInboxSession
  MobileApiController.getRemoteConfiguration
*/
