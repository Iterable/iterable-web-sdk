import { IterableResponse } from '../types';
import { UpdateSubscriptionParams, UpdateUserParams } from './types';
export declare const updateUserEmail: (newEmail: string) => import("../types").IterablePromise<IterableResponse>;
export declare const updateUser: (payload?: UpdateUserParams) => import("../types").IterablePromise<IterableResponse>;
export declare const updateSubscriptions: (payload?: Partial<UpdateSubscriptionParams>) => import("../types").IterablePromise<IterableResponse>;
