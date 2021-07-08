export interface InAppMessagesRequestParams {
  count: number;
  platform?: 'iOS' | 'Android';
  SDKVersion?: string;
  packageName?: string;
  /* 
    email and userID params omitted in favor of using the "setEmail" 
    or "setUserID" methods on the _initIdentify_ method
  */
  //  email?: string;
  //  userId?: string
}

export interface InAppDisplaySetting {
  percentage: number;
}

export interface InAppMessage {
  messageId: string;
  campaignId: string;
  createdAt: string;
  expiresAt: string;
  content: {
    html: string;
    inAppDisplaySettings: {
      top: InAppDisplaySetting;
      right: InAppDisplaySetting;
      left: InAppDisplaySetting;
      bottom: InAppDisplaySetting;
      bgColor: {
        alpha: number;
        hex: string;
      };
      shouldAnimate: boolean;
    };
  };
  customPayload: Record<string, any>;
  trigger: {
    type: string;
  };
  saveToInbox: boolean;
  inboxMetadata: {
    title: string;
    subtitle: string;
    icon: string;
  };
  priorityLevel: number;
  read: boolean;
}

export interface InAppMessageResponse {
  inAppMessages: Partial<InAppMessage>[];
}
