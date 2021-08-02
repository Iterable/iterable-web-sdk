/**
 * @jest-environment jsdom
 */
import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import { messages } from '../../__data__/inAppMessages';
import { getInAppMessages } from '../inapp';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('getInAppMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('getInAppMessages without auto painting', () => {
    it('should just return a promise if auto-paint flag is false', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: messages
      });
      mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});

      const response = await getInAppMessages({ count: 10 });

      expect(response.data.inAppMessages.length).toBe(3);
    });
  });

  describe('getInAppMessages with auto painting', () => {
    it('should return correct values when auto-paint flag is true', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: messages
      });
      mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});

      const response = await getInAppMessages({ count: 10 }, true);
      expect(response.pauseMessageStream).toBeDefined();
      expect(response.resumeMessageStream).toBeDefined();
      expect(response.request).toBeDefined();
    });
  });
});
