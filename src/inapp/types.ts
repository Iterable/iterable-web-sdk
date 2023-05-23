import { IterablePromise } from 'src/types';

export enum CLOSE_BUTTON_POSITION {
  TopLeft = 'top-left',
  TopRight = 'top-right'
}

export type CloseButtonPosition = `${CLOSE_BUTTON_POSITION}`;

export enum HANDLE_LINKS {
  OpenAllNewTab = 'open-all-new-tab',
  OpenAllSameTab = 'open-all-same-tab',
  ExternalNewTab = 'external-new-tab'
}

export type HandleLinks = `${HANDLE_LINKS}`;

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
  handleLinks?: HandleLinks;
  closeButton?: {
    color?: string;
    iconPath?: string;
    /* If true, prevent user from dismissing in-app message by clicking outside of message */
    isRequiredToDismissMessage?: boolean;
    position?: CloseButtonPosition;
    sideOffset?: string;
    size?: string | number;
    topOffset?: string;
  };
  /** messageId of the latest (i.e., most recent) message in the device's local cache */
  latestCachedMessageId?: string;
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

export interface GetInAppMessagesResponse {
  pauseMessageStream: () => void;
  resumeMessageStream: () => Promise<HTMLIFrameElement | ''>;
  request: () => IterablePromise<InAppMessageResponse>;
  triggerDisplayMessages: (
    messages: Partial<InAppMessage>[]
  ) => Promise<HTMLIFrameElement | ''>;
}

export type CachedMessage = [string, InAppMessage];

export enum DISPLAY_OPTIONS {
  immediate = 'immediate',
  deferred = 'deferred'
}

/** template literal type: allows string literals to be used for display options */
export type DisplayOptions = `${DISPLAY_OPTIONS}`;

export interface InAppDisplaySetting {
  percentage?: number;
  displayOption?: string;
}

export interface WebInAppDisplaySettings {
  position: 'Center' | 'TopRight' | 'BottomRight' | 'Full';
}

export type BrowserStorageEstimate = StorageEstimate & {
  /** usageDetails not supported in Safari */
  usageDetails?: { indexedDB?: number };
};

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
