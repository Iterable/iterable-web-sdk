import { IterablePromise } from '../types';

export enum CloseButtonPosition {
  TopLeft = 'top-left',
  TopRight = 'top-right'
}

export enum HandleLinks {
  OpenAllNewTab = 'open-all-new-tab',
  OpenAllSameTab = 'open-all-same-tab',
  ExternalNewTab = 'external-new-tab'
}

export enum DisplayOptions {
  Immediate = 'immediate',
  Deferred = 'deferred'
}

export enum DisplayPosition {
  Center = 'Center',
  TopRight = 'TopRight',
  BottomRight = 'BottomRight',
  Full = 'Full'
}

export interface InAppDisplaySetting {
  percentage?: number;
  displayOption?: string;
}

export interface WebInAppDisplaySettings {
  position: DisplayPosition;
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
      bgColor?: { alpha: number; hex: string };
      shouldAnimate?: boolean;
    };
    webInAppDisplaySettings: WebInAppDisplaySettings;
  };
  customPayload: Record<string, any>;
  trigger: { type: string };
  saveToInbox: boolean;
  inboxMetadata: {
    title: string;
    subtitle: string;
    icon: string;
  };
  priorityLevel: number;
  read: boolean;
}

export type PaintIframeProps = {
  /** html you want to paint to the DOM inside the iframe */
  html: string;
  /** screen position the message should appear in */
  position: WebInAppDisplaySettings['position'];
  /** if the in-app should animate in/out */
  shouldAnimate?: boolean;
  /** The message you want the screen reader to read when popping up the message */
  srMessage?: string;
  /** how many px or % buffer between the in-app message and the top of the screen */
  topOffset?: string;
  /** how many px or % buffer between the in-app message and the bottom of the screen */
  bottomOffset?: string;
  /** how many px or % buffer between the in-app message and the right of the screen */
  rightOffset?: string;
  /** An explicitly set max width for the in-app message.
   * Only applies to `Center`, `TopRight`, and `BottomRight` positions. */
  maxWidth?: string;
};

type CloseButton = {
  color?: string;
  iconPath?: string;
  /* If true, prevent user from dismissing in-app message by clicking outside of message. */
  isRequiredToDismissMessage?: boolean;
  position?: CloseButtonPosition;
  sideOffset?: string;
  size?: string | number;
  topOffset?: string;
};

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
  closeButton?: CloseButton;
  /** messageId of the latest (i.e., most recent) message in the device's local cache */
  latestCachedMessageId?: string;
  /** Set a default max-width style for message iframe.
   * Only applies to `Center`, `TopRight`, and `BottomRight` positions. */
  maxWidth?: string;
}

export interface InAppMessagesRequestParams extends SDKInAppMessagesParams {
  count: number;
  SDKVersion?: string;
  packageName: string;
  // platform?: IterablePlatform; forced to "Web"

  /** `email` and `userID` params omitted in favor of using the "setEmail"
   * or "setUserID" methods on the _initialize_ method. */
  //  email?: string;
  //  userId?: string
}

export interface InAppMessageResponse {
  inAppMessages: Partial<InAppMessage>[];
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

export type BrowserStorageEstimate = StorageEstimate & {
  /** usageDetails not supported in Safari */
  usageDetails?: { indexedDB?: number };
};
