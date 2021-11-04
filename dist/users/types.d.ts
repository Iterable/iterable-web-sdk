export interface GetUserResponse {
    user?: {
        email: string;
        /** @todo ask about the typings here */
        dataFields?: Record<string, any>;
        userId?: string;
        mergeNestedObjects?: Record<string, any>;
        mergeArrayKeys?: Record<string, any>;
        correlationId?: string;
    };
}
export interface UpdateUserParams {
    dataFields?: Record<string, any>;
    preferUserId?: boolean;
    mergeNestedObjects?: boolean;
}
export interface UpdateSubscriptionParams {
    emailListIds: number[];
    unsubscribedChannelIds: number[];
    unsubscribedMessageTypeIds: number[];
    subscribedMessageTypeIds: number[];
    campaignId: number;
    templateId: number;
}
