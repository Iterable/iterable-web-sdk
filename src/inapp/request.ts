import { delMany, entries } from 'idb-keyval';
import { GETMESSAGES_PATH, SDK_VERSION, WEB_PLATFORM } from 'src/constants';
import { baseIterableRequest } from 'src/request';
import { addNewMessagesToCache, getCachedMessagesToDelete } from './cache';
import schema from './inapp.schema';
import {
  CachedMessage,
  InAppMessage,
  InAppMessageResponse,
  InAppMessagesRequestParams
} from './types';

type RequestInAppMessagesProps = {
  latestCachedMessageId?: string;
  payload: InAppMessagesRequestParams;
};

export const requestInAppMessages = ({
  latestCachedMessageId,
  payload
}: RequestInAppMessagesProps) =>
  baseIterableRequest<InAppMessageResponse>({
    method: 'GET',
    /** @note Parameter will be enabled once new endpoint is ready */
    // url: options?.useLocalCache ? CACHE_ENABLED_GETMESSAGES_PATH : GETMESSAGES_PATH,
    url: GETMESSAGES_PATH,
    validation: { params: schema },
    params: {
      ...payload,
      platform: WEB_PLATFORM,
      SDKVersion: SDK_VERSION,
      latestCachedMessageId
    }
  });

type RequestMessagesProps = {
  payload: InAppMessagesRequestParams;
};

export const requestMessages = async ({ payload }: RequestMessagesProps) => {
  /** @note Caching implementation and associated parameter will be enabled once new endpoint is ready */
  // if (!options?.useLocalCache) return await requestInAppMessages({});
  /** @note Always early return until then */
  return await requestInAppMessages({ payload });

  try {
    const cachedMessages: CachedMessage[] = await entries();

    /** Determine most recent cached message */
    let latestCachedMessageId: string | undefined;
    let latestCreatedAtTimestamp: EpochTimeStamp = 0;
    cachedMessages.forEach(([cachedMessageId, cachedMessage]) => {
      if (cachedMessage.createdAt > latestCreatedAtTimestamp) {
        latestCachedMessageId = cachedMessageId;
        latestCreatedAtTimestamp = cachedMessage.createdAt;
      }
    });

    /**
     * Call getMessages with latestCachedMessageId to get the message delta
     * (uncached messages have full detail, rest just have messageId)
     */
    const response = await requestInAppMessages({
      latestCachedMessageId,
      payload
    });
    const { inAppMessages } = response.data;

    /** Combine cached messages with NEW messages in delta response */
    const allMessages: Partial<InAppMessage>[] = [];
    const newMessages: { messageId: string; message: InAppMessage }[] = [];
    inAppMessages?.forEach((inAppMessage) => {
      /**
       * If message in response has no content property, then that means it is
       * older than the latest cached message and should be retrieved from the
       * cache using the messageId
       *
       * Expecting messages with no content to look like the last 2 messages...
       * {
       *   inAppMessages: [
       *     { ...messageWithContentHasFullDetails01 },
       *     { ...messageWithContentHasFullDetails02 },
       *     { messageId: 'messageWithoutContentHasNoOtherProperties01' },
       *     { messageId: 'messageWithoutContentHasNoOtherProperties02' }
       *   ]
       * }
       */
      if (!inAppMessage.content) {
        const cachedMessage = cachedMessages.find(
          ([messageId]) => inAppMessage.messageId === messageId
        );
        if (cachedMessage) allMessages.push(cachedMessage[1]);
      } else {
        allMessages.push(inAppMessage);
        if (inAppMessage.messageId)
          newMessages.push({
            messageId: inAppMessage.messageId,
            message: inAppMessage as InAppMessage
          });
      }
    });

    /** Delete messages not present in fetch from cache */
    const cachedMessagesToDelete = getCachedMessagesToDelete(
      cachedMessages,
      inAppMessages
    );
    try {
      await delMany(cachedMessagesToDelete);
    } catch (err: any) {
      console.warn(
        'Error deleting messages from the browser cache',
        err?.response?.data?.clientErrors ?? err
      );
    }

    /** Add new messages to the cache if they fit in the cache */
    await addNewMessagesToCache(newMessages);

    /** Return combined response */
    return {
      ...response,
      data: {
        inAppMessages: allMessages
      }
    };
  } catch (err: any) {
    console.warn(
      'Error requesting in-app messages',
      err?.response?.data?.clientErrors ?? err
    );
  }
  return await requestInAppMessages({ payload });
};
