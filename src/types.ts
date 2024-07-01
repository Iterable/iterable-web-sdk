import { AxiosError, AxiosPromise } from 'axios';

/**
  make one property in an interface optional 
  @thanks https://stackoverflow.com/a/61108377/7455960
*/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type IterablePromise<T = any> = AxiosPromise<T>;

export type IterablePromiseRejection<T = any> = AxiosError<T>;

export type IterableErrorStatus =
  | 'Success'
  | 'BadApiKey'
  | 'BadParams'
  | 'BadJsonBody'
  | 'QueueEmailError'
  | 'GenericError'
  | 'InvalidEmailAddressError'
  | 'DatabaseError'
  | 'EmailAlreadyExists'
  | 'Forbidden'
  | 'JwtUserIdentifiersMismatched'
  | 'InvalidJwtPayload';

export type IterablePlatform = 'iOS' | 'Android' | 'Web';

/*
  potential response for both 200+ and 400+
*/
export interface IterableResponse {
  code: IterableErrorStatus;
  msg: string;
  params?: null | Record<string, any>;
}

export interface ErrorHandler {
  (error: any): void;
}
