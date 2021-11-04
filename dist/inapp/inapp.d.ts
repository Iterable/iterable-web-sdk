import { InAppMessagesRequestParams, InAppMessageResponse } from './types';
import { IterablePromise } from '../types';
export declare const clearMessages: () => void;
export declare function getInAppMessages(payload: InAppMessagesRequestParams): IterablePromise<InAppMessageResponse>;
export declare function getInAppMessages(payload: InAppMessagesRequestParams, showInAppMessagesAutomatically: true): {
    pauseMessageStream: () => void;
    resumeMessageStream: () => Promise<HTMLIFrameElement | ''>;
    request: () => IterablePromise<InAppMessageResponse>;
};
