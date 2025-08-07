import Axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { AnySchema, ValidationError } from 'yup';
import {
  BASE_URL,
  STATIC_HEADERS,
  EU_ITERABLE_API,
  GET_CRITERIA_PATH,
  INITIALIZE_ERROR,
  ENDPOINT_TRACK_UNKNOWN_SESSION,
  ENDPOINT_UNKNOWN_USER_CONSENT
} from './constants';
import { IterablePromise, IterableResponse } from './types';
import { config } from './utils/config';
import { getTypeOfAuth } from './utils/typeOfAuth';
import AuthorizationToken from './utils/authorizationToken';

interface ExtendedRequestConfig extends AxiosRequestConfig {
  validation?: {
    data?: AnySchema;
    params?: AnySchema;
  };
  sendBeacon?: boolean;
}

interface ClientError extends IterableResponse {
  clientErrors: {
    error: string;
    field?: string;
  }[];
}

const ENDPOINTS_NOT_REQUIRING_TYPE_OF_AUTH = [
  GET_CRITERIA_PATH,
  ENDPOINT_TRACK_UNKNOWN_SESSION,
  ENDPOINT_UNKNOWN_USER_CONSENT
];

export const baseAxiosRequest = Axios.create({
  baseURL: BASE_URL
});

export const baseIterableRequest = <T = any>(
  payload: ExtendedRequestConfig
): IterablePromise<T> => {
  try {
    const endpoint = payload?.url ?? '';

    // for most Iterable API endpoints, we require a user to be initialized in the SDK.
    if (
      !ENDPOINTS_NOT_REQUIRING_TYPE_OF_AUTH.includes(endpoint) &&
      getTypeOfAuth() === null
    ) {
      return Promise.reject(INITIALIZE_ERROR);
    }
    if (payload.validation?.data && payload.data) {
      payload.validation.data.validateSync(payload.data, { abortEarly: false });
    }
    if (payload.validation?.params && payload.params) {
      payload.validation.params.validateSync(payload.params, {
        abortEarly: false
      });
    }

    const baseURL = config.getConfig('isEuIterableService')
      ? EU_ITERABLE_API
      : config.getConfig('baseURL');

    const authorizationToken = new AuthorizationToken();
    const JWT = authorizationToken.getToken();

    // Only add JWT Authorization header if endpoint requires it
    // Unknown user endpoints should only use API key
    // Also ensure we have a valid authenticated user before using JWT
    const hasValidAuth = getTypeOfAuth() !== null;
    const shouldAddJWTAuth =
      !ENDPOINTS_NOT_REQUIRING_TYPE_OF_AUTH.includes(endpoint) &&
      JWT &&
      hasValidAuth;
    const Authorization = shouldAddJWTAuth ? `Bearer ${JWT}` : undefined;

    return baseAxiosRequest({
      ...payload,
      baseURL,
      headers: {
        ...payload.headers,
        ...STATIC_HEADERS,
        ...(Authorization && { Authorization })
      },
      paramsSerializer: (params: any) =>
        qs.stringify(params, { arrayFormat: 'repeat' })
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
    // eslint-disable-next-line prefer-promise-reject-errors
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
