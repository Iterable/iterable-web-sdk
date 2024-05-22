import { baseIterableRequest } from '../request';
import {
  IterableEmbeddedMessageUpdateHandler,
  IterableEmbeddedMessage
} from './types';
import { IterableResponse } from '../types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { ErrorMessage } from './consts';
import { SDK_VERSION, WEB_PLATFORM, ENDPOINTS } from '../constants';
import { trackEmbeddedReceived } from '../events/embedded/events';
import { handleEmbeddedClick as embeddedClick } from './utils';

export class IterableEmbeddedManager {
  public appPackageName: string;
  private messages: IterableEmbeddedMessage[] = [];
  private updateListeners: IterableEmbeddedMessageUpdateHandler[] = [];

  constructor(appPackageName: string) {
    this.appPackageName = appPackageName;
  }

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
      const params: any = {};
      if (placementIds.length > 0) {
        params.placementIds = placementIds[0];
        if (placementIds.length > 1) {
          params.placementIds += placementIds
            .slice(1)
            .map((id) => `&placementIds=${id}`)
            .join('');
        }
      }
      const iterableResult: any = await baseIterableRequest<IterableResponse>({
        method: 'GET',
        url: ENDPOINTS.get_embedded_messages.route,
        params: {
          ...params,
          platform: WEB_PLATFORM,
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

  private getEmbeddedMessages(placements: any): IterableEmbeddedMessage[] {
    let messages: IterableEmbeddedMessage[] = [];
    placements.forEach((placement: any) => {
      messages = [...messages, ...placement.embeddedMessages];
    });
    return messages;
  }

  private setMessages(_processor: EmbeddedMessagingProcessor) {
    this.messages = _processor.processedMessagesList();
  }

  public getMessages(): IterableEmbeddedMessage[] {
    return this.messages;
  }

  public getMessagesForPlacement(
    placementId: number
  ): IterableEmbeddedMessage[] {
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
      await trackEmbeddedReceived(
        msgsList[i].metadata.messageId,
        this.appPackageName
      );
    }
  }

  public addUpdateListener(
    updateListener: IterableEmbeddedMessageUpdateHandler
  ) {
    this.updateListeners.push(updateListener);
  }

  private notifyUpdateDelegates() {
    this.updateListeners.forEach(
      (updateListener: IterableEmbeddedMessageUpdateHandler) => {
        updateListener.onMessagesUpdated();
      }
    );
  }

  private notifyDelegatesOfInvalidApiKeyOrSyncStop() {
    this.updateListeners.forEach(
      (updateListener: IterableEmbeddedMessageUpdateHandler) => {
        updateListener.onEmbeddedMessagingDisabled();
      }
    );
  }

  //Get the list of updateHandlers
  public getUpdateHandlers(): IterableEmbeddedMessageUpdateHandler[] {
    return this.updateListeners;
  }

  public handleEmbeddedClick(clickedUrl: string | null) {
    embeddedClick(clickedUrl);
  }
}
