import { IterableEmbeddedManager } from './embeddedManager';
import { setTypeOfAuthForTestingOnly } from '../testing';

// Mock the baseIterableRequest function
jest.mock('../request', () => ({
  baseIterableRequest: jest.fn()
}));

// Mock the trackEmbeddedMessageReceived function
jest.mock('..', () => ({
  trackEmbeddedMessageReceived: jest.fn()
}));

describe('EmbeddedManager', () => {
  beforeEach(() => {
    setTypeOfAuthForTestingOnly('email');
  });
  const appPackageName = 'my-website';
  describe('syncMessages', () => {
    it('should call syncMessages and callback', async () => {
      const embeddedManager = new IterableEmbeddedManager(appPackageName);
      const syncMessagesMock = jest.spyOn(embeddedManager, 'syncMessages');
      const callbackMock = jest.fn();

      await embeddedManager.syncMessages('my-website', callbackMock, [0]);

      expect(syncMessagesMock).toHaveBeenCalled();
      expect(callbackMock).toHaveBeenCalled();
    });

    it('should handle error and call notifyDelegatesOfInvalidApiKeyOrSyncStop', async () => {
      const embeddedManager = new IterableEmbeddedManager(appPackageName);

      async function mockTest() {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Invalid API Key');
        });
      }

      jest.spyOn(embeddedManager, 'syncMessages');
      await embeddedManager.syncMessages('my-website', jest.fn(), [0]);

      expect(() => mockTest()).rejects.toMatch('Invalid API Key');
    });
  });

  describe('EmbeddedManager', () => {
    let embeddedManager: IterableEmbeddedManager | null;

    beforeEach(() => {
      embeddedManager = new IterableEmbeddedManager(appPackageName);
    });

    describe('addUpdateListener', () => {
      it('should add an update listener to the list', () => {
        if (embeddedManager instanceof IterableEmbeddedManager) {
          const updateListener = {
            onMessagesUpdated: jest.fn(),
            onEmbeddedMessagingDisabled: jest.fn()
          };

          embeddedManager.addUpdateListener(updateListener);

          expect(embeddedManager.getUpdateHandlers()).toContain(updateListener);
        }
      });
    });
  });
});
