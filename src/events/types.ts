export interface IEmbeddedMessageMetadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}

export interface IEmbeddedMessageElementsButton {
  id: string;
  title: string;
  action?: IEmbeddedMessageElementsButtonAction;
}

export interface IEmbeddedMessageElementsText {
  id: string;
  text?: string;
}

export interface IEmbeddedMessageElementsButtonAction {
  type: string;
  data?: string;
}

export interface IEmbeddedMessageElementsDefaultAction {
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

export interface IEmbeddedMessage {
  metadata: IEmbeddedMessageMetadata;
  elements?: IEmbeddedMessageElements;
  payload?: Array<any>;
}

export interface IEmbeddedImpression {
  messageId: string;
  displayCount: number;
  duration: number;
}

export interface IEmbeddedSession {
  start?: Date;
  end?: Date;
  placementId?: string;
  impressions?: Array<IEmbeddedImpression>;
  id: string;
}

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  appPackageName: string;
}

export interface EnbeddedMessagingDismiss {
  email: string;
  userId: string;
  messageId: string;
  buttonIdentifier: string;
  deviceInfo: DeviceInfo;
  createdAt: number;
}

export interface Session {
  id: string;
  start: string;
  end: string;
}

export interface Impression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: string;
}

export interface EnbeddedMessagingSession {
  userId: string;
  session: Session;
  impressions: Array<Impression>;
  deviceInfo: DeviceInfo;
  createdAt: number;
}
