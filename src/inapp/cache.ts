import { setMany } from 'idb-keyval';
import { BrowserStorageEstimate, CachedMessage, InAppMessage } from './types';

/**
 * Detect amount of local storage remaining (quota) and used (usage).
 * If usageDetails exist (not supported in Safari), use this instead of usage.
 */
export const determineRemainingStorageQuota = async () => {
  try {
    if (!('indexedDB' in window)) return 0;

    const storage: BrowserStorageEstimate | undefined =
      'storage' in navigator && 'estimate' in navigator.storage
      ? await navigator.storage.estimate()
      : undefined;

    /** 50 MB is the lower common denominator on modern mobile browser caches. */
    const mobileBrowserQuota = 52428800;
    /** Max quota of browser storage that in-apps will potentially fill */
    const estimatedBrowserQuota = storage?.quota;
    /**
     * Determine lower max quota that can be used for message cache, set to
     * 60% of quota to leave space for other caching needs on that domain.
     */
    const messageQuota = ((estimatedBrowserQuota
        Math.min(estimatedBrowserQuota, mobileBrowserQuota)) ??
        mobileBrowserQuota) * 0.6;

    /** How much local storage is being used. */
    const usage = storage?.usageDetails?.indexedDB ?? storage?.usage;
    const remainingQuota = usage && messageQuota - usage;

    return remainingQuota || 0;
  } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    // eslint-disable-next-line no-console
    console.warn(
      'Error determining remaining storage quota',
      err?.response?.data?.clientErrors ?? err
    );
  }
  /** Do not try to add to cache if we cannot determine storage space. */
  return 0;
};

/**
 * Deletes cached messages not present in latest getMessages fetch.
 * @param cachedMessages
 * @param fetchedMessages
 */
export const getCachedMessagesToDelete = (
  cachedMessages: CachedMessage[],
  fetchedMessages: Partial<InAppMessage>[]
) =>
  cachedMessages.reduce((deleteQueue: string[], [cachedMessageId]) => {
  const isCachedMessageInFetch = fetchedMessages.reduce(
    (isFound, { messageId }) => {
      if (messageId === cachedMessageId) isFound = true;
      return isFound;
    },
    false
  );

  if (!isCachedMessageInFetch) deleteQueue.push(cachedMessageId);
  return deleteQueue;
}, []);

/**
 * Adds messages to cache only if they fit within the quota, starting with
 * oldest messages since newer messages can still be easily retrieved via
 * new requests while passing in latestCachedMessageId param.
 * @param messages
 * @param quota
 */
export const addNewMessagesToCache = async (
  messages: { messageId: string; message: InAppMessage }[]
) => {
  const quota = await determineRemainingStorageQuota();
  if (quota > 0) {
    /**
     * Determine total size (in bytes) of new messages to be added to cache
     * sorted oldest to newest (ascending createdAt property).
     */
    const messagesWithSizes: {
      messageId: string;
      message: InAppMessage;
      createdAt: number;
      size: number;
    }[] = messages
      .map(({ messageId, message }) => {
        const sizeInBytes = new Blob([
          JSON.stringify(message).replace(/\[\[\],"\]/g, '')
        ]).size;
        return {
          messageId,
          message,
          createdAt: message.createdAt,
          size: sizeInBytes
        };
      })
      .sort((a, b) => a.createdAt - b.createdAt);

    /** Only add messages that fit in cache, starting from oldest messages. */
    let remainingQuota = quota;
    const messagesToAddToCache: [string, InAppMessage][] = [];
    messagesWithSizes.every(({ messageId, message, size }) => {
      if (remainingQuota - size < 0) return false;
      remainingQuota -= size;
      messagesToAddToCache.push([messageId, message]);
      return true;
    });

    try {
      await setMany(messagesToAddToCache);
    } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      // eslint-disable-next-line no-console
      console.warn(
        'Error adding new messages to the browser cache',
        err?.response?.data?.clientErrors ?? err
      );
    }
  }
};
