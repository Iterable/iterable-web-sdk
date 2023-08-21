export interface EmbeddedMessageUpdateHandler {
    onMessagesUpdated: Function
    onEmbeddedMessagingDisabled: Function
}

export interface EmbeddedMessageActionHandler {
    onTapAction(): Function
}

export interface IEmbeddedImpressionData
{
    messageId: string;
    displayCount: number;
    duration: number;
    start?: Date;
}