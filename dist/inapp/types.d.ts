interface SDKInAppMessagesParams {
    displayInterval?: number;
    onOpenScreenReaderMessage?: string;
    onOpenNodeToTakeFocus?: string;
}
export interface InAppMessagesRequestParams extends SDKInAppMessagesParams {
    count: number;
    SDKVersion?: string;
    packageName: string;
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
        html: string;
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
export {};
