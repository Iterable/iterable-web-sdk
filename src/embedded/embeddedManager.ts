import { baseIterableRequest } from '../request';
import {
  EmbeddedMessageUpdateHandler,
  IterableActionSource,
  IterableAction
} from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessageData } from '../../src/events/embedded/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { embedded_msg_endpoint, ErrorMessage } from './consts';
import { trackEmbeddedMessageReceived } from 'src/events/embedded/events';
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
import { trackEmbeddedMessageClickSchema } from 'src/events/embedded/events.schema';
import { functions } from 'src/utils/functions';

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
      let params: any = {};
      params = functions.addEmailOrUserIdToJson(params, localStorage);
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
      let messages = {} as IEmbeddedMessageData;
      messages.messageId = msgsList[i].metadata.messageId;
      messages = functions.addEmailOrUserIdToJson(messages, localStorage);
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

  handleEmbeddedClick(
    message: any,
    buttonIdentifier: string | null,
    clickedUrl: string | null
  ) {
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
        data: trackEmbeddedMessageClickSchema
      }
    });
  }
}
