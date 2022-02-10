import { InAppEventRequestParams, InAppTrackRequestParams } from './types';
import { IterableResponse } from '../types';
export declare const track: (payload: InAppTrackRequestParams) => import("../types").IterablePromise<IterableResponse>;
export declare const trackInAppClose: (payload: InAppEventRequestParams) => import("../types").IterablePromise<IterableResponse>;
export declare const trackInAppOpen: (payload: Omit<InAppEventRequestParams, 'clickedUrl' | 'inboxSessionId' | 'closeAction'>) => import("../types").IterablePromise<IterableResponse>;
export declare const trackInAppClick: (payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>) => import("../types").IterablePromise<IterableResponse>;
export declare const trackInAppDelivery: (payload: Omit<InAppEventRequestParams, 'clickedUrl' | 'closeAction' | 'inboxSessionId'>) => import("../types").IterablePromise<IterableResponse>;
export declare const trackInAppConsume: (payload: Omit<InAppEventRequestParams, 'clickedUrl' | 'closeAction' | 'inboxSessionId'>) => import("../types").IterablePromise<IterableResponse>;
