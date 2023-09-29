export interface EmbeddedMessageUpdateHandler {
  onMessagesUpdated: () => void;
  onEmbeddedMessagingDisabled: () => void;
}

export interface EmbeddedMessageActionHandler {
  onTapAction: (url: string) => void;
}

export interface IEmbeddedImpressionData {
  messageId: string;
  displayCount: number;
  duration: number;
  start?: Date;
}
