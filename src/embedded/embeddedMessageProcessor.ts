import { IEmbeddedMessage } from '../../src/events/types';

export class EmbeddedMessagingProcessor {
  private currentMessages: Array<IEmbeddedMessage>;
  private fetchedMessages: Array<IEmbeddedMessage>;

  constructor(
    currentMessages: Array<IEmbeddedMessage>,
    fetchedMessages: Array<IEmbeddedMessage>
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
      (messageInfo: IEmbeddedMessage) =>
        !this.getCurrentMessageIds().includes(messageInfo.metadata.messageId)
    );
  }

  public getCurrentMessageIds(): string[] {
    return this.currentMessages.map(
      (messageInfo: IEmbeddedMessage) => messageInfo.metadata.messageId
    );
  }

  public getFetchedMessageIds(): string[] {
    return this.fetchedMessages.map(
      (messageInfo: IEmbeddedMessage) => messageInfo.metadata.messageId
    );
  }
}
