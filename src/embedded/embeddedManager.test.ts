import { EmbeddedManager } from './embeddedManager';

// Mock the baseIterableRequest function
jest.mock('../request', () => ({
  baseIterableRequest: jest.fn()
}));

// Mock the trackEmbeddedMessageReceived function
jest.mock('..', () => ({
  trackEmbeddedMessageReceived: jest.fn()
}));

describe('EmbeddedManager', () => {
  const appPackageName = 'my-website';
  describe('syncMessages', () => {
    it('should call syncMessages and callback', async () => {
      const embeddedManager = new EmbeddedManager(appPackageName);
      const syncMessagesMock = jest.spyOn(embeddedManager, 'syncMessages');
      const callbackMock = jest.fn();

      await embeddedManager.syncMessages('my-website', callbackMock, [0]);

      expect(syncMessagesMock).toHaveBeenCalled();
      expect(callbackMock).toHaveBeenCalled();
    });

    it('should handle error and call notifyDelegatesOfInvalidApiKeyOrSyncStop', async () => {
      const embeddedManager = new EmbeddedManager(appPackageName);

      async function mockTest() {
        return new Promise(function (resolve, reject) {
          reject('Invalid API Key');
        });
      }

      jest.spyOn(embeddedManager, 'syncMessages');
      await embeddedManager.syncMessages('my-website', jest.fn(), [0]);

      expect(() => mockTest()).rejects.toMatch('Invalid API Key');
    });
  });

  describe('EmbeddedManager', () => {
    let embeddedManager: EmbeddedManager | null;

    beforeEach(() => {
      embeddedManager = new EmbeddedManager(appPackageName);
    });

    describe('addUpdateListener', () => {
      it('should add an update listener to the list', () => {
        if (embeddedManager instanceof EmbeddedManager) {
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
