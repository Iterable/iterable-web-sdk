import { EmbeddedManager } from './EmbeddedManager';

// Mock the baseIterableRequest function
jest.mock('../request', () => ({
    baseIterableRequest: jest.fn(),
}));

// Mock the trackEmbeddedMessageReceived function
jest.mock('..', () => ({
    trackEmbeddedMessageReceived: jest.fn(),
}));

describe('EmbeddedManager', () => {
    describe('syncMessages', () => {
        it('should call syncMessages and callback', async () => {
            const embeddedManager = new EmbeddedManager();
            const syncMessagesMock = jest.spyOn(embeddedManager, 'syncMessages');
            const callbackMock = jest.fn();

            await embeddedManager.syncMessages('user123', callbackMock);

            expect(syncMessagesMock).toHaveBeenCalledWith('user123');
            expect(callbackMock).toHaveBeenCalled();
        });

        it('should handle error and call notifyDelegatesOfInvalidApiKeyOrSyncStop', async () => {
            const embeddedManager = new EmbeddedManager();
            const syncMessagesMock = jest.spyOn(embeddedManager, 'syncMessages');
            syncMessagesMock.mockRejectedValue({
                response: {
                    data: {
                        msg: 'Invalid API Key',
                    },
                },
            });

            const notifyDelegatesMock = jest.spyOn(embeddedManager, 'notifyDelegatesOfInvalidApiKeyOrSyncStop');

            await embeddedManager.syncMessages('user123', jest.fn());

            expect(syncMessagesMock).toHaveBeenCalledWith('user123');
            expect(notifyDelegatesMock).toHaveBeenCalled();
        });
    });

    describe('EmbeddedManager', () => {
        let embeddedManager;

        beforeEach(() => {
            embeddedManager = new EmbeddedManager();
        });

        describe('addUpdateListener', () => {
            it('should add an update listener to the list', () => {
                const updateListener = {
                    onMessagesUpdated: jest.fn(),
                    onEmbeddedMessagingDisabled: jest.fn(),
                };

                embeddedManager.addUpdateListener(updateListener);

                expect(embeddedManager.getUpdateHandlers()).toContain(updateListener);
            });
        });

        describe('addActionHandler', () => {
            it('should add an action handler to the list', () => {
                const actionHandler = {
                    onTapAction: jest.fn(),
                };

                embeddedManager.addActionHandler(actionHandler);

                expect(embeddedManager.getActionHandlers()).toContain(actionHandler);
            });
        });
    });
});
