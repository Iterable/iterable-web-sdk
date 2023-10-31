export interface InAppTrackRequestParams {
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
  messageId: string;
  userId: string;
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
