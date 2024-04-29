export interface IEmbeddedMessageElementsButton {
  id: string;
  title: string;
  action?: IEmbeddedMessageElementsButtonAction;
}
export interface IEmbeddedMessageElementsButtonAction {
  type: string;
  data?: string;
}
export interface IEmbeddedMessageElements {
  title?: string;
  body?: string;
  mediaUrl?: string;

  buttons?: [IEmbeddedMessageElementsButton];
  text?: [IEmbeddedMessageElementsText];
  defaultAction?: IEmbeddedMessageElementsDefaultAction;
}
export interface IEmbeddedMessageElementsText {
  id: string;
  text?: string;
}
export interface IEmbeddedMessageElementsDefaultAction {
  type: string;
  data?: string;
}

export interface IEmbeddedMessageMetadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  appPackageName: string;
}

export interface IEmbeddedMessageData {
  email?: string;
  userId?: string;
  messageId: string;
  metadata: IEmbeddedMessageMetadata;
  elements?: IEmbeddedMessageElements;
  payload?: Array<any>;
}

export interface IEmbeddedMessage {
  email?: string;
  userId?: string;
  messageId: string;
  metadata?: IEmbeddedMessageMetadata;
  elements?: IEmbeddedMessageElements;
  payload?: Array<any>;
  deviceInfo: {
    appPackageName: string; // customer-defined name
  };
}

export interface EmbeddedMessagingDismiss {
  email?: string;
  userId?: string;
  messageId: string;
  buttonIdentifier: string;
  deviceInfo: DeviceInfo;
  createdAt: number;
}

export interface Session {
  id: string;
  start?: number;
  end?: number;
}

export interface Impression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: string;
}

export interface EmbeddedMessagingSession {
  userId?: string;
  email?: string;
  session: Session;
  impressions: Array<Impression>;
  deviceInfo: DeviceInfo;
  createdAt: number;
}

export interface EmbeddedTrackClick {
  messageId: string;
  buttonIdentifier: string;
  clickedUrl: string;
  appPackageName?: string;
}

export interface IEmbeddedImpressionData {
  messageId: string;
  displayCount: number;
  duration: number;
  start?: Date;
}

export interface IEmbeddedSession {
  start?: Date;
  end?: Date;
  placementId?: string;
  impressions?: Array<IEmbeddedImpressionData>;
  id: string;
  deviceInfo?: {
    appPackageName: string; // customer-defined name
  };
}
