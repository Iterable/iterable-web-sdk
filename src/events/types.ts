import { IterablePlatform } from '../types';

export interface InAppEventRequestParams {
  // email?: string;
  // userId: string;
  messageId: string;
  clickedUrl?: string;
  messageContext?: {
    saveToInbox?: boolean;
    silentInbox?: boolean;
    location?: string;
  };
  closeAction?: string;
  deviceInfo?: {
    deviceId?: string;
    platform?: IterablePlatform;
    appPackageName?: string;
  };
  inboxSessionId?: string;
  createdAt?: number;
}
