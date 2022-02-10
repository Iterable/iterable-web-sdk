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
        appPackageName: string;
    };
    inboxSessionId?: string;
    createdAt?: number;
}
