/**
 * @jest-environment jsdom
 */
import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import { messages } from '../../__data__/inAppMessages';
import { getInAppMessages } from '../inapp';

jest.mock('../../utils/srSpeak', () => ({
  srSpeak: jest.fn()
}));

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('getInAppMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockRequest.resetHistory();

    mockRequest.onGet('/inApp/getMessages').reply(200, {
      inAppMessages: messages
    });
    mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});
  });

  describe('getInAppMessages without auto painting', () => {
    it('should just return a promise if auto-paint flag is false', async () => {
      const response = await getInAppMessages({ count: 10 });

      expect(response.data.inAppMessages.length).toBe(4);
    });

    it('should track in app messages delivered', async () => {
      await getInAppMessages({ count: 10 });

      expect(
        mockRequest.history.post.filter((e) =>
          e.url?.match(/trackInAppDelivery/gim)
        ).length
      ).toBe(4);
    });
  });

  describe('getInAppMessages with auto painting', () => {
    let mockOnLoad: any;

    beforeAll(() => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: messages
      });
      mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});
      mockRequest.onPost('/events/trackInAppClick').reply(200, {});
    });

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllTimers();
      jest.clearAllMocks();
      jest.resetAllMocks();
      mockRequest.resetHistory();
      document.body.innerHTML = '';

      Object.defineProperty(global.Image.prototype, 'onload', {
        configurable: true,
        get() {
          return this._onload;
        },
        set(onload: any) {
          mockOnLoad = onload;
          this._onload = onload;
        }
      });
    });

    it('should return correct values when auto-paint flag is true', async () => {
      const response = await getInAppMessages({ count: 10 }, true);
      expect(response.pauseMessageStream).toBeDefined();
      expect(response.resumeMessageStream).toBeDefined();
      expect(response.request).toBeDefined();
    });

    it('should paint an iframe to the DOM', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBe('IFRAME');
    });

    it('should remove the iframe when dismiss link is clicked', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://dismiss"]'
      ) as Element;

      /* click the dismiss link and the iframe should be gone */
      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(document.getElementById('iterable-iframe')).toBe(null);
      expect(
        JSON.parse(
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )[0].data
        ).clickedUrl
      ).toBe('iterable://dismiss');
    });

    it('should remove the iframe when esc key is pressed', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      expect(document.getElementById('iterable-iframe')?.tagName).toBe(
        'IFRAME'
      );
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      await document.dispatchEvent(escEvent);
      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should remove the iframe when overlay is clicked', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      expect(document.getElementById('iterable-iframe')?.tagName).toBe(
        'IFRAME'
      );

      const element = document.querySelector('[data-test-overlay]');

      const clickEvent = new MouseEvent('click');
      element?.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should paint next message to the DOM after 30s after first is dismissed', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://dismiss"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);

      jest.advanceTimersByTime(32000);

      /* there are 3 images in the second mock in-app message, so load the images 3 times */
      mockOnLoad();
      mockOnLoad();
      mockOnLoad();

      expect(
        document
          .getElementById('iterable-iframe')
          ?.querySelector('a[href="superdraft://close"]')
      ).toBeDefined();
    });

    it('should not paint next message to the DOM after 30s if queue is paused', async () => {
      const { request, pauseMessageStream } = getInAppMessages(
        { count: 10 },
        true
      );
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://dismiss"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      pauseMessageStream();
      jest.advanceTimersByTime(32000);

      expect(document.body.innerHTML).toBe('');
    });

    it('should paint next messsage to DOM if resumed', async () => {
      const { request, pauseMessageStream, resumeMessageStream } =
        getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://dismiss"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      pauseMessageStream();
      jest.advanceTimersByTime(32000);
      resumeMessageStream();

      mockOnLoad();
      mockOnLoad();
      mockOnLoad();

      expect(
        (
          document.getElementById('iterable-iframe') as HTMLIFrameElement
        )?.contentWindow?.document.body?.querySelector(
          'a[href="superdraft://"]'
        )
      ).toBeDefined();
    });

    it('should navigate offsite in a new tab if a clicked link has target _blank', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="google.com" target="_blank" />'
            }
          }
        ]
      });
      const mockOpen = jest.fn();
      global.open = mockOpen;

      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      expect(mockOpen).toHaveBeenCalledWith(
        'google.com',
        '_blank',
        'noopenner,noreferrer'
      );
    });

    it('should navigate to site in same tab upon link click', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="google.com" />'
            }
          }
        ]
      });
      const mockRouteChange = jest.fn();
      delete global.location;
      global.location = {} as any;
      global.location.assign = mockRouteChange;

      const { request } = getInAppMessages({ count: 10 }, true);
      await request();
      mockOnLoad();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      expect(mockRouteChange).toHaveBeenCalledWith('google.com');
    });

    it('should track in app messages delivered', async () => {
      const { request } = getInAppMessages({ count: 10 }, true);
      await request();

      expect(
        mockRequest.history.post.filter((e) =>
          e.url?.match(/trackInAppDelivery/gim)
        ).length
      ).toBe(4);
    });
  });
});
