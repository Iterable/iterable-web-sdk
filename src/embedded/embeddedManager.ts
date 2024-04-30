import { baseIterableRequest } from '../request';
import {
  EmbeddedMessageUpdateHandler,
  IterableActionSource,
  IterableAction
} from './types';
import { IterableResponse } from '../types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { embedded_msg_endpoint, ErrorMessage } from './consts';
import { IterableActionRunner } from 'src/utils/IterableActionRunner';
import {
  URL_SCHEME_ITBL,
  URL_SCHEME_ACTION,
  URL_SCHEME_OPEN,
  WEB_PLATFORM,
  SDK_VERSION
} from '../constants';
import { IterableEmbeddedMessage } from './embeddedMessage';
import { EndPoints } from 'src/events/consts';
import { trackEmbeddedClickSchema } from 'src/events/embedded/events.schema';
import { EmbeddedMessage } from '../events/embedded/types';
import { trackEmbeddedReceived } from '../events/embedded/events';

export class EmbeddedManager {
  public appPackageName: string;
  private messages: EmbeddedMessage[] = [];
  private updateListeners: EmbeddedMessageUpdateHandler[] = [];

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

  private getEmbeddedMessages(placements: any): EmbeddedMessage[] {
    let messages: EmbeddedMessage[] = [];
    placements.forEach((placement: any) => {
      messages = [...messages, ...placement.embeddedMessages];
    });
    return messages;
  }

  private setMessages(_processor: EmbeddedMessagingProcessor) {
    this.messages = _processor.processedMessagesList();
  }

  public getMessages(): EmbeddedMessage[] {
    return this.messages;
  }

  public getMessagesForPlacement(placementId: number): EmbeddedMessage[] {
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

  handleEmbeddedClick(clickedUrl: string | null) {
    if (clickedUrl && clickedUrl.trim() !== '') {
      let actionType: string;
      let actionName: string;

      if (clickedUrl.startsWith(URL_SCHEME_ACTION)) {
        actionName = '';
        actionType = clickedUrl;
      } else if (clickedUrl.startsWith(URL_SCHEME_ITBL)) {
        actionName = '';
        actionType = clickedUrl.replace(URL_SCHEME_ITBL, '');
      } else {
        actionType = URL_SCHEME_OPEN;
        actionName = clickedUrl;
      }

      const iterableAction: IterableAction = {
        type: actionType,
        data: actionName
      };

      IterableActionRunner.executeAction(
        null,
        iterableAction,
        IterableActionSource.EMBEDDED
      );
    }
  }

  trackEmbeddedClick(
    message: IterableEmbeddedMessage,
    buttonIdentifier: string,
    clickedUrl: string
  ) {
    const payload = {
      messageId: message?.metadata?.messageId,
      buttonIdentifier: buttonIdentifier,
      targetUrl: clickedUrl,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName: window.location.hostname
      },
      createdAt: Date.now()
    };

    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: EndPoints.msg_click_event_track,
      data: payload,
      validation: {
        data: trackEmbeddedClickSchema
      }
    });
  }
}
