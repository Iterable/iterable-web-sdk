export interface EmbeddedMessageUpdateHandler {
  onMessagesUpdated: () => void;
  onEmbeddedMessagingDisabled: () => void;
}

export interface IEmbeddedImpressionData {
  messageId: string;
  displayCount: number;
  duration: number;
  start?: Date;
}
