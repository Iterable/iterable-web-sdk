import { baseIterableRequest } from '../request';
import { EmbeddedMessageUpdateHandler } from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessageData } from '../../src/events/embedded/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { embedded_msg_endpoint, ErrorMessage } from './consts';
import { trackEmbeddedMessageReceived } from 'src/events/embedded/events';
import { SDK_VERSION } from '../constants';
export class EmbeddedManager {
  private messages: IEmbeddedMessageData[] = [];
  private updateListeners: EmbeddedMessageUpdateHandler[] = [];

  public async syncMessages(
    packageName: string,
    callback: () => void,
    placementIds?: number[]
  ) {
    await this.retrieveEmbeddedMessages(packageName, placementIds || []);
    callback();
  }

  private async retrieveEmbeddedMessages(
    packageName: string,
    placementIds: number[]
  ) {
    try {
      let url = `${embedded_msg_endpoint}?`;
      const params: any = {};
      if (placementIds.length > 0) {
        params.placementIds = placementIds
          .map((id) => `&placementIds=${id}`)
          .join('');
      }
      url = url.replace(/&$/, '');
      const iterableResult: any = await baseIterableRequest<IterableResponse>({
        method: 'GET',
        url: url,
        params: {
          ...params,
          platform: 'Web',
          sdkVersion: SDK_VERSION,
          packageName: packageName
        }
      });
      const embeddedMessages = this.getEmbeddedMessages(
        iterableResult?.data?.placements || []
      );
      if (embeddedMessages.length) {
        const processor = new EmbeddedMessagingProcessor(
          [...this.messages],
          this.getEmbeddedMessages(iterableResult?.data?.placements)
        );
        this.setMessages(processor);
        await this.trackNewlyRetrieved(processor);
        this.messages = [
          ...this.getEmbeddedMessages(iterableResult?.data?.placements)
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

  private getEmbeddedMessages(placements: any): IEmbeddedMessageData[] {
    let messages: IEmbeddedMessageData[] = [];
    placements.forEach((placement: any) => {
      messages = [...messages, ...placement.embeddedMessages];
    });
    return messages;
  }

  private setMessages(_processor: EmbeddedMessagingProcessor) {
    this.messages = _processor.processedMessagesList();
  }

  public getMessages(): Array<IEmbeddedMessageData> {
    return this.messages;
  }

  public getMessagesForPlacement(
    placementId: number
  ): Array<IEmbeddedMessageData> {
    return this.messages.filter((message) => {
      return message.metadata.placementId === placementId;
    });
  }

  private async trackNewlyRetrieved(_processor: EmbeddedMessagingProcessor) {
    const msgsList = _processor.newlyRetrievedMessages();
    if (msgsList.length > 0) {
      this.notifyUpdateDelegates();
    }
    for (let i = 0; i < msgsList.length; i++) {
      const messages = {} as IEmbeddedMessageData;
      messages.messageId = msgsList[i].metadata.messageId;
      await trackEmbeddedMessageReceived(messages);
    }
  }

  public addUpdateListener(updateListener: EmbeddedMessageUpdateHandler) {
    this.updateListeners.push(updateListener);
  }

  private notifyUpdateDelegates() {
    this.updateListeners.forEach(
      (updateListener: EmbeddedMessageUpdateHandler) => {
        updateListener.onMessagesUpdated();
      }
    );
  }

  private notifyDelegatesOfInvalidApiKeyOrSyncStop() {
    this.updateListeners.forEach(
      (updateListener: EmbeddedMessageUpdateHandler) => {
        updateListener.onEmbeddedMessagingDisabled();
      }
    );
  }

  //Get the list of updateHandlers
  public getUpdateHandlers(): Array<EmbeddedMessageUpdateHandler> {
    return this.updateListeners;
  }
}
