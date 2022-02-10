import { AxiosRequestConfig } from 'axios';
import { IterablePromise } from './types';
import { AnySchema } from 'yup';
interface ExtendedRequestConfig extends AxiosRequestConfig {
    validation?: {
        data?: AnySchema;
        params?: AnySchema;
    };
}
export declare const baseAxiosRequest: import("axios").AxiosInstance;
export declare const baseIterableRequest: <T = any>(payload: ExtendedRequestConfig) => IterablePromise<T>;
export {};
