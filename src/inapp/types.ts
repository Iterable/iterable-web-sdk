interface SDKInAppMessagesParams {
  displayInterval?: number;
  /* what should the screen reader say once the message opens */
  onOpenScreenReaderMessage?: string;
  /* what DOM Node do you want to take keyboard focus when the message opens */
  onOpenNodeToTakeFocus?: string;
  topOffset?: string;
  bottomOffset?: string;
  rightOffset?: string;
  /* how long the in-app messages take to animate in/out */
  animationDuration?: number;
  handleLinks?: 'open-all-new-tab' | 'open-all-same-tab' | 'external-new-tab';
  closeButton?: {
    color?: string;
    iconPath?: string;
    position?: 'top-left' | 'top-right';
    /* If true, prevent user from dismissing in-app message by clicking outside of message */
    isRequiredToDismissMessage?: boolean;
    sideOffset?: string;
    size?: string | number;
    topOffset?: string;
  };
}

export interface InAppMessagesRequestParams extends SDKInAppMessagesParams {
  count: number;
  // platform?: IterablePlatform; forced to "Web"
  SDKVersion?: string;
  packageName: string;
  /* 
    email and userID params omitted in favor of using the "setEmail" 
    or "setUserID" methods on the _initialize_ method
  */
  //  email?: string;
  //  userId?: string
}

export interface InAppDisplaySetting {
  percentage?: number;
  displayOption?: string;
}

export interface WebInAppDisplaySettings {
  position: 'Center' | 'TopRight' | 'BottomRight' | 'Full';
}

export interface InAppMessage {
  messageId: string;
  campaignId: number;
  createdAt: number;
  expiresAt: number;
  content: {
    payload?: Record<string, any>;
    html: string | HTMLIFrameElement;
    inAppDisplaySettings: {
      top: InAppDisplaySetting;
      right: InAppDisplaySetting;
      left: InAppDisplaySetting;
      bottom: InAppDisplaySetting;
      bgColor?: {
        alpha: number;
        hex: string;
      };
      shouldAnimate?: boolean;
    };
    webInAppDisplaySettings: WebInAppDisplaySettings;
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
