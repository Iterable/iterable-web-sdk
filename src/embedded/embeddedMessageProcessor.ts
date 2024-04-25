import { IEmbeddedMessageData } from '../../src/events/embedded/types';

export class EmbeddedMessagingProcessor {
  private currentMessages: Array<IEmbeddedMessageData>;
  private fetchedMessages: Array<IEmbeddedMessageData>;

  constructor(
    currentMessages: Array<IEmbeddedMessageData>,
    fetchedMessages: Array<IEmbeddedMessageData>
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
      (messageInfo: IEmbeddedMessageData) =>
        !this.getCurrentMessageIds().includes(messageInfo.metadata.messageId)
    );
  }

  public getCurrentMessageIds(): string[] {
    return this.currentMessages.map(
      (messageInfo: IEmbeddedMessageData) => messageInfo.metadata.messageId
    );
  }

  public getFetchedMessageIds(): string[] {
    return this.fetchedMessages.map(
      (messageInfo: IEmbeddedMessageData) => messageInfo.metadata.messageId
    );
  }
}
