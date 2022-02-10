import { TrackPurchaseRequestParams, UpdateCartRequestParams } from './types';
import { IterableResponse } from '../types';
export declare const updateCart: (payload: UpdateCartRequestParams) => import("../types").IterablePromise<IterableResponse>;
export declare const trackPurchase: (payload: TrackPurchaseRequestParams) => import("../types").IterablePromise<IterableResponse>;
