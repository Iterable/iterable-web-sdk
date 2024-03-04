export interface InAppTrackRequestParams {
  userId?: string;
  email?: string;
  eventName: string;
  id?: string;
  createdAt?: number;
  dataFields?: Record<string, any>;
  campaignId?: number;
  templateId?: number;
}

export interface InAppEventRequestParams {
  messageId: string;
  clickedUrl?: string;
  messageContext?: {
    saveToInbox?: boolean;
    silentInbox?: boolean;
    location?: string;
  };
  closeAction?: string;
  deviceInfo: {
    // deviceId?: string; forced to userAgent
    // platform?: IterablePlatform; forced to "Web."
    appPackageName: string; // customer-defined name
  };
  inboxSessionId?: string;
  createdAt?: number;
}
