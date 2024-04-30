import { EmbeddedMessage } from "..";

export class EmbeddedMessagingProcessor {
  private currentMessages: EmbeddedMessage[];
  private fetchedMessages: EmbeddedMessage[];

  constructor(
    currentMessages: EmbeddedMessage[],
    fetchedMessages: EmbeddedMessage[]
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
      (messageInfo: EmbeddedMessage) =>
        !this.getCurrentMessageIds().includes(messageInfo.metadata.messageId)
    );
  }

  public getCurrentMessageIds(): string[] {
    return this.currentMessages.map(
      (messageInfo: EmbeddedMessage) => messageInfo.metadata.messageId
    );
  }

  public getFetchedMessageIds(): string[] {
    return this.fetchedMessages.map(
      (messageInfo: EmbeddedMessage) => messageInfo.metadata.messageId
    );
  }
}
