import { IterableEmbeddedMessage } from './types';

export class EmbeddedMessagingProcessor {
  private currentMessages: IterableEmbeddedMessage[];
  private fetchedMessages: IterableEmbeddedMessage[];

  constructor(
    currentMessages: IterableEmbeddedMessage[],
    fetchedMessages: IterableEmbeddedMessage[]
  ) {
    this.currentMessages = currentMessages; // old messages
    this.fetchedMessages = fetchedMessages; // all messages
  }

  public processedMessagesList() {
    return this.fetchedMessages;
  }

  public newlyRetrievedMessages() {
    return this.getNewMessages();
  }

  public getNewMessages() {
    return this.fetchedMessages.filter(
      (messageInfo: IterableEmbeddedMessage) =>
        !this.getCurrentMessageIds().includes(messageInfo.metadata.messageId)
    );
  }

  public getCurrentMessageIds(): string[] {
    return this.currentMessages.map(
      (messageInfo: IterableEmbeddedMessage) => messageInfo.metadata.messageId
    );
  }

  public getFetchedMessageIds(): string[] {
    return this.fetchedMessages.map(
      (messageInfo: IterableEmbeddedMessage) => messageInfo.metadata.messageId
    );
  }
}
