import { baseIterableRequest } from '../request';
import { EmbeddedMessageUpdateHandler, EmbeddedMessageActionHandler } from './types';
import { IterableResponse } from '../types';
import { IEmbeddedMessage } from '../events/types';
import { EmbeddedMessagingProcessor } from './embeddedMessageProcessor';
import { trackEmbeddedMessageReceived } from '..';

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
                url: '/embedded-messaging/messages?userId=' + userId,
            });

            if (iterableResult?.data?.embeddedMessages?.length) {
                let processor = new EmbeddedMessagingProcessor([...this.messages], iterableResult?.data?.embeddedMessages)

                this.setMessages(processor);
                await this.trackNewlyRetrieved(processor);
                this.messages = [...iterableResult?.data?.embeddedMessages];
            }
        } catch (error: any) {
            if (error.response.data) {
                const { msg } = error.response.data;

                if ((msg.toLowerCase() === ("Invalid API Key").toLowerCase() || msg.toLowerCase() === ("SUBSCRIPTION_INACTIVE").toLowerCase())) {
                    this.notifyDelegatesOfInvalidApiKeyOrSyncStop();
                }
            }
        }
    }

    public setMessages(_processor: EmbeddedMessagingProcessor) {
        this.messages = _processor.processedMessagesList()
    }

    public async trackNewlyRetrieved(_processor: EmbeddedMessagingProcessor) {
        const msgsList = _processor.newlyRetrievedMessages();

        for (let i = 0; i < msgsList.length; i++) {
            await trackEmbeddedMessageReceived(msgsList[i]);
        }
    }

    public addUpdateListener(updateListener: EmbeddedMessageUpdateHandler) {
        this.updateListeners.push(updateListener);
    }

    public addActionHandler(actionHandler: EmbeddedMessageActionHandler) {
        this.actionListeners.push(actionHandler);
    }
    
    public notifyDelegatesOfInvalidApiKeyOrSyncStop() {
        this.updateListeners.forEach((updateListener: EmbeddedMessageUpdateHandler) => {
            updateListener.onEmbeddedMessagingDisabled(); 
        });
    }

    public getActionHandlers(): Array<EmbeddedMessageActionHandler> {
        return this.actionListeners
    }

    //Get the list of updateHandlers
    public getUpdateHandlers(): Array<EmbeddedMessageUpdateHandler> {
        return this.updateListeners
    }
}