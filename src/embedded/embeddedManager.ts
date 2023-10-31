import { baseIterableRequest } from '../request';
import {
  EmbeddedMessageUpdateHandler,
  EmbeddedMessageActionHandler
} from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessage } from '../events/embedded/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { trackEmbeddedMessageReceived } from '../events';
import { embedded_msg_endpoint, ErrorMessage } from './consts';

export class EmbeddedManager {
  private messages: IEmbeddedMessage[] = [];
  private updateListeners: EmbeddedMessageUpdateHandler[] = [];
  private actionListeners: EmbeddedMessageActionHandler[] = [];

  public async syncMessages(userId: string, callback: () => void) {
    await this.retrieveEmbeddedMessages(userId);
    callback();
  }

  private async retrieveEmbeddedMessages(userId: string) {
    try {
      const iterableResult: any = await baseIterableRequest<IterableResponse>({
        method: 'GET',
        url: `${embedded_msg_endpoint}?userId=${userId}`
      });
      if (iterableResult?.data?.placements[0]?.embeddedMessages?.length) {
        const processor = new EmbeddedMessagingProcessor(
          [...this.messages],
          iterableResult?.data?.placements[0]?.embeddedMessages
        );
        this.setMessageProcesser(processor);
        await this.trackNewlyRetrieved(processor, userId);
        this.messages = [
          ...iterableResult?.data?.placements[0]?.embeddedMessages
        ];
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

  private setMessageProcesser(_processor: EmbeddedMessagingProcessor) {
    this.messages = _processor.processedMessagesList();
  }

  public getMessages(): Array<IEmbeddedMessage> {
    return this.messages;
  }

  private async trackNewlyRetrieved(
    _processor: EmbeddedMessagingProcessor,
    userId: string
  ) {
    const msgsList = _processor.newlyRetrievedMessages();
    msgsList.forEach(async (message) => {
      await trackEmbeddedMessageReceived({
        ...message,
        messageId: message?.metadata?.messageId,
        userId
      });
    });
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

  private notifyDelegatesOfInvalidApiKeyOrSyncStop() {
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
