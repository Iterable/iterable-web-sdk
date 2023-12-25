import { baseIterableRequest } from '../request';
import {
  EmbeddedMessageUpdateHandler,
  EmbeddedMessageActionHandler
} from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessage } from '../events/embedded/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { embedded_msg_endpoint, ErrorMessage } from './consts';
import { trackEmbeddedMessageReceived } from 'src/events/embedded/events';

export class EmbeddedManager {
  private messages: IEmbeddedMessage[] = [];
  private updateListeners: EmbeddedMessageUpdateHandler[] = [];
  private actionListeners: EmbeddedMessageActionHandler[] = [];

  public async syncMessages(
    userId: string,
    email: string,
    platform: string,
    sdkVersion: string,
    packageName: string,
    callback: () => void,
    placementIds?: number[]
  ) {
    await this.retrieveEmbeddedMessages(
      userId,
      email,
      platform,
      sdkVersion,
      packageName,
      placementIds || []
    );
    callback();
  }

  private async retrieveEmbeddedMessages(
    userId: string,
    email: string,
    platform: string,
    sdkVersion: string,
    packageName: string,
    placementIds: number[]
  ) {
    try {
      let url = `${embedded_msg_endpoint}?`;

      if (userId.trim() !== '') {
        url += `userId=${userId}&`;
      }

      if (email.trim() !== '') {
        url += `email=${email}&`;
      }

      url += `platform=${platform}`;
      url += `&sdkVersion=${sdkVersion}`;
      url += `&packageName=${packageName}`;

      if (placementIds.length > 0) {
        url += placementIds.map((id) => `&placementIds=${id}`).join('');
      }
      url = url.replace(/&$/, '');

      const iterableResult: any = await baseIterableRequest<IterableResponse>({
        method: 'GET',
        url: url
      });
      const embeddedMessages = this.getEmbeddedMessages(
        iterableResult?.data?.placements || []
      );
      if (embeddedMessages.length) {
        const processor = new EmbeddedMessagingProcessor(
          [...this.messages],
          embeddedMessages
        );
        this.setMessages(processor);
        await this.trackNewlyRetrieved(processor, userId, email);
        this.messages = [...embeddedMessages];
      }
    } catch (error: any) {
      if (error?.response?.data) {
        const { msg } = error.response.data;
        if (
          msg.toLowerCase() === ErrorMessage.invalid_api_key.toLowerCase() ||
          msg.toLowerCase() === ErrorMessage.subscription_inactive.toLowerCase()
        ) {
          this.notifyDelegatesOfInvalidApiKeyOrSyncStop();
        }
      }
    }
  }

  private getEmbeddedMessages(placements: any): IEmbeddedMessage[] {
    let messages: IEmbeddedMessage[] = [];
    placements.forEach((placement: any) => {
      messages = [...messages, ...placement.embeddedMessages];
    });
    return messages;
  }

  private setMessages(_processor: EmbeddedMessagingProcessor) {
    this.messages = _processor.processedMessagesList();
  }

  public getMessages(): Array<IEmbeddedMessage> {
    return this.messages;
  }

  public getMessagesForPlacement(placementId: number): Array<IEmbeddedMessage> {
    return this.messages.filter((message) => {
      return message.metadata.placementId === placementId;
    });
  }

  private async trackNewlyRetrieved(
    _processor: EmbeddedMessagingProcessor,
    userId: string,
    email: string
  ) {
    const msgsList = _processor.newlyRetrievedMessages();
    for (let i = 0; i < msgsList.length; i++) {
      const messages = {} as IEmbeddedMessage;
      messages.metadata = msgsList[i].metadata;
      if (userId !== undefined) {
        messages.userId = userId;
      }

      if (email !== undefined) {
        messages.email = email;
      }
      await trackEmbeddedMessageReceived(messages);
    }
  }

  public addUpdateListener(updateListener: EmbeddedMessageUpdateHandler) {
    this.updateListeners.push(updateListener);
  }

  public addActionHandler(actionHandler: EmbeddedMessageActionHandler) {
    this.actionListeners.push(actionHandler);
  }

  // private notifyUpdateDelegates() {
  //     this.updateListeners.forEach((updateListener: EmbeddedMessageUpdateHandler) => {
  //         updateListener.onMessagesUpdated();
  //     });
  // }

  public notifyDelegatesOfInvalidApiKeyOrSyncStop() {
    this.updateListeners.forEach(
      (updateListener: EmbeddedMessageUpdateHandler) => {
        updateListener.onEmbeddedMessagingDisabled();
      }
    );
  }

  public getActionHandlers(): Array<EmbeddedMessageActionHandler> {
    return this.actionListeners;
  }

  //Get the list of updateHandlers
  public getUpdateHandlers(): Array<EmbeddedMessageUpdateHandler> {
    return this.updateListeners;
  }
}
