import { messages } from '../../__data__/inAppMessages';
import { getCachedMessagesToDelete } from '../cache';
import { CachedMessage, InAppMessage } from '../types';

describe('cache.ts', () => {
  describe('Caching', () => {
    const now = Date.now();
    const allMessages = [...messages];

    const cachedMessages: CachedMessage[] = allMessages.flatMap((msg) => [
      [msg.messageId, msg]
    ]);

    it('should delete cached messages that are expired', () => {
      const unexpiredMessages = allMessages.filter(
        (msg) => msg.expiresAt > now
      );
      const expiredMessageIds = allMessages.reduce(
        (allFetchedIds: string[], message) => {
          if (message.expiresAt < now) allFetchedIds.push(message.messageId);
          return allFetchedIds;
        },
        []
      );

      const messagesForDeletion = getCachedMessagesToDelete(
        cachedMessages,
        unexpiredMessages
      );
      expect(messagesForDeletion).toEqual(expiredMessageIds);
    });

    it('should delete any cached messages not included in the fetch', () => {
      const validMessages: InAppMessage[] = [];
      const invalidMessages: InAppMessage[] = [];
      allMessages.forEach((msg) =>
        msg.messageId === 'normalMessage!'
          ? validMessages.push(msg)
          : invalidMessages.push(msg)
      );

      const messagesForDeletion = getCachedMessagesToDelete(
        cachedMessages,
        validMessages
      );
      expect(messagesForDeletion).toEqual(
        invalidMessages.map((msg) => msg.messageId)
      );
    });
  });
});
