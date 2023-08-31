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
    appPackageName: string; // customer-defined name
  };
  inboxSessionId?: string;
  createdAt?: number;
}

export interface IEmbeddedMessageMetadata {
  messageId: string
  campaignId?: number
  isProof?: boolean
  placementId?: number
}

export interface IEmbeddedMessageElementsButton {
  id: string
  title: string
  action?: IEmbeddedMessageElementsButtonAction
}

export interface IEmbeddedMessageElementsText {
  id: string
  text?: string
}

export interface IEmbeddedMessageElementsButtonAction {
  type: string
  data?: string
}

export interface IEmbeddedMessageElementsDefaultAction {
  type: string
  data?: string
}

export interface IEmbeddedMessageElements {
  title?: string
  body?: string
  mediaUrl?: string
  
  buttons?: [IEmbeddedMessageElementsButton]
  text?: [IEmbeddedMessageElementsText]
  defaultAction?: IEmbeddedMessageElementsDefaultAction
}

export interface IEmbeddedMessage {
  messageId: string
  metadata: IEmbeddedMessageMetadata
  elements?: IEmbeddedMessageElements
  payload?: Array<any>
  deviceInfo: {
    appPackageName: string; // customer-defined name
  };
}

export interface IEmbeddedImpression {
  messageId: string
  displayCount: number
  duration: number
  displayDuration?: number
}

export interface ISession {
  start?: number
  end?: number
  id: string
}

export interface IEventEmbeddedSession {
  session: ISession
  placementId?: string
  impressions?: Array<IEmbeddedImpression>
  deviceInfo: {
    appPackageName: string; // customer-defined name
  };
}

export interface IEmbeddedSession {
  start?: Date
  end?: Date
  id: string
  placementId?: string
  impressions?: Array<IEmbeddedImpression>
}
