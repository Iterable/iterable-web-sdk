import {
  IEmbeddedImpression,
  IEmbeddedMessageElements,
  IEmbeddedMessageMetadata
} from '../../../src/types';
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

export interface ISession {
  start?: number;
  end?: number;
  id: string;
}

export interface IEventEmbeddedSession {
  session: ISession;
  placementId?: string;
  impressions?: Array<IEmbeddedImpression>;
  deviceInfo: {
    appPackageName: string; // customer-defined name
  };
}
