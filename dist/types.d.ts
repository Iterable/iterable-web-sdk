import { AxiosError, AxiosPromise } from 'axios';
/**
  make one property in an interface optional
  @thanks https://stackoverflow.com/a/61108377/7455960
*/
export declare type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export declare type IterablePromise<T = any> = AxiosPromise<T>;
export declare type IterablePromiseRejection<T = any> = AxiosError<T>;
export declare type IterableErrorStatus = 'Success' | 'BadApiKey' | 'BadParams' | 'BadJsonBody' | 'QueueEmailError' | 'GenericError' | 'InvalidEmailAddressError' | 'DatabaseError' | 'EmailAlreadyExists' | 'Forbidden' | 'InvalidJwtPayload';
export declare type IterablePlatform = 'iOS' | 'Android' | 'Web';
export interface IterableResponse {
    code: IterableErrorStatus;
    msg: string;
    params?: null | Record<string, any>;
}
