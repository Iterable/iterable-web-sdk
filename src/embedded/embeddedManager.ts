import { baseIterableRequest } from '../request';
import {
  EmbeddedMessageUpdateHandler,
  IterableActionSource,
  IterableAction
} from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessage } from '../events/embedded/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { embedded_msg_endpoint, ErrorMessage } from './consts';
import { trackEmbeddedMessageReceived } from 'src/events/embedded/events';
import { functions } from 'src/utils/functions';
import { IterableActionRunner } from '.';
import {
  URL_SCHEME_ITBL,
  URL_SCHEME_ACTION,
  URL_SCHEME_OPEN,
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID
} from '../constants';
import { trackEmbeddedMessageClick } from '..';

export class EmbeddedManager {
  private messages: IEmbeddedMessage[] = [];
  private updateListeners: EmbeddedMessageUpdateHandler[] = [];

  public async syncMessages(
    userIdOrEmail: string,
    platform: string,
    sdkVersion: string,
    packageName: string,
    callback: () => void,
    placementIds?: number[]
  ) {
    await this.retrieveEmbeddedMessages(
      userIdOrEmail,
      platform,
      sdkVersion,
      packageName,
      placementIds || []
    );
    callback();
  }

  private async retrieveEmbeddedMessages(
    userIdOrEmail: string,
    platform: string,
    sdkVersion: string,
    packageName: string,
    placementIds: number[]
  ) {
    try {
      let url = `${embedded_msg_endpoint}?`;

      url += functions.checkEmailValidation(userIdOrEmail)
        ? `email=${userIdOrEmail}&`
        : `userId=${userIdOrEmail}&`;
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
          this.getEmbeddedMessages(iterableResult?.data?.placements)
        );
        this.setMessages(processor);
        await this.trackNewlyRetrieved(processor, userIdOrEmail);
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
    userIdOrEmail: string
  ) {
    const msgsList = _processor.newlyRetrievedMessages();
    if (msgsList.length > 0) {
      this.notifyUpdateDelegates();
    }
    for (let i = 0; i < msgsList.length; i++) {
      const messages = {} as IEmbeddedMessage;
      messages.messageId = msgsList[i].metadata.messageId;

      functions.checkEmailValidation(userIdOrEmail)
        ? (messages.email = userIdOrEmail)
        : (messages.userId = userIdOrEmail);
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
        actionType = URL_SCHEME_ACTION;
        actionName = clickedUrl.replace(URL_SCHEME_ACTION, '');
      } else if (clickedUrl.startsWith(URL_SCHEME_ITBL)) {
        actionType = URL_SCHEME_ITBL;
        actionName = clickedUrl.replace(URL_SCHEME_ITBL, '');
      } else {
        actionType = URL_SCHEME_OPEN;
        actionName = clickedUrl.replace(URL_SCHEME_OPEN, '');
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
    message: any,
    buttonIdentifier: string | '',
    clickedUrl: string | ''
  ) {
    const payload = {
      messageId: message?.metadata?.messageId,
      campaignId: message?.metadata?.campaignId
    };

    const emailOrUserId =
      (localStorage.getItem(SHARED_PREF_EMAIL) as string) ??
      (localStorage.getItem(SHARED_PREF_USER_ID) as string);

    console.log('email', emailOrUserId);
    trackEmbeddedMessageClick(
      payload,
      buttonIdentifier,
      clickedUrl,
      window.location.hostname,
      Date.now(),
      emailOrUserId
    );
  }
}
