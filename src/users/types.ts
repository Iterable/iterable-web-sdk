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
  userId?: string;
  dataFields?: Record<string, any>;
  preferUserId?: boolean;
  mergeNestedObjects?: boolean;
  headers?: Record<string, any>;
}

export interface UpdateSubscriptionParams {
  emailListIds: number[];
  unsubscribedChannelIds: number[];
  unsubscribedMessageTypeIds: number[];
  subscribedMessageTypeIds: number[];
  campaignId: number;
  templateId: number;
}
