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
