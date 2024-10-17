import Axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { AnySchema, ValidationError } from 'yup';
import {
  BASE_URL,
  STATIC_HEADERS,
  EU_ITERABLE_API,
  GET_CRITERIA_PATH,
  INITIALIZE_ERROR
} from './constants';
import { IterablePromise, IterableResponse } from './types';
import { config } from './utils/config';
import { getTypeOfAuth } from './utils/typeOfAuth';

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

const ENDPOINTS_REQUIRING_USER = [GET_CRITERIA_PATH];

export const baseAxiosRequest = Axios.create({
  baseURL: BASE_URL
});

export const baseIterableRequest = <T = any>(
  payload: ExtendedRequestConfig
): IterablePromise<T> => {
  try {
    const endpoint = payload?.url ?? '';

    // for most Iterable API endpoints, we require a userId or email to be set

    console.log({ auth: getTypeOfAuth() });
    if (
      !ENDPOINTS_REQUIRING_USER.includes(endpoint) &&
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

    return baseAxiosRequest({
      ...payload,
      baseURL,
      headers: {
        ...payload.headers,
        ...STATIC_HEADERS
      },
      paramsSerializer: (params) =>
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
