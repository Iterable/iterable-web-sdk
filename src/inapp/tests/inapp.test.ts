/**
 * @jest-environment jsdom
 */
import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import { messages } from '../../__data__/inAppMessages';
import { getInAppMessages } from '../inapp';
import { initIdentify } from '../../authorization';
import { WEB_PLATFORM } from '../../constants';
import { createClientError } from '../../utils/testUtils';

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
    it('should send up correct payload', async () => {
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });

      expect(response.config.params.packageName).toBe('my-lil-website');
      expect(response.config.params.platform).toBe(WEB_PLATFORM);
      expect(response.config.params.count).toBe(10);
    });

    it('should reject if fails client-side validation', async () => {
      try {
        await getInAppMessages({} as any);
      } catch (e) {
        expect(e).toEqual(
          createClientError([
            {
              error: 'count is a required field',
              field: 'count'
            },
            {
              error: 'packageName is a required field',
              field: 'packageName'
            }
          ])
        );
      }
    });

    it('should not include passed email or userId as query params', async () => {
      const response = await getInAppMessages({
        email: 'hello@gmail.com',
        userId: '1234',
        count: 10,
        packageName: 'my-lil-website'
      } as any);

      expect(response.config.params.email).toBeUndefined();
      expect(response.config.params.userId).toBeUndefined();
    });

    it('should just return a promise if auto-paint flag is false', async () => {
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });

      expect(response.data.inAppMessages.length).toBe(3);
    });

    it('should track in app messages delivered', async () => {
      await getInAppMessages({ count: 10, packageName: 'my-lil-website' });

      expect(
        mockRequest.history.post.filter((e) =>
          e.url?.match(/trackInAppDelivery/gim)
        ).length
      ).toBe(3);
    });
  });

  describe('getInAppMessages with auto painting', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: messages
      });
      mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});
      mockRequest.onPost('/events/trackInAppClick').reply(200, {});
    });

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      mockRequest.resetHistory();
      document.body.innerHTML = '';
    });

    it('should send up correct payload', async () => {
      const response = await getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      ).request();

      expect(response.config.params.packageName).toBe('my-lil-website');
      expect(response.config.params.platform).toBe(WEB_PLATFORM);
      expect(response.config.params.count).toBe(10);
    });

    it('should reject if fails client-side validation', async () => {
      try {
        await getInAppMessages({} as any, true).request();
      } catch (e) {
        expect(e).toEqual(
          createClientError([
            {
              error: 'count is a required field',
              field: 'count'
            },
            {
              error: 'packageName is a required field',
              field: 'packageName'
            }
          ])
        );
      }
    });

    it('should return correct values when auto-paint flag is true', async () => {
      const response = await getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      expect(response.pauseMessageStream).toBeDefined();
      expect(response.resumeMessageStream).toBeDefined();
      expect(response.request).toBeDefined();
    });

    it('should not include passed email or userId as query params', async () => {
      const response = await getInAppMessages(
        {
          email: 'hello@gmail.com',
          userId: '1234',
          count: 10,
          packageName: 'my-lil-website'
        } as any,
        true
      ).request();

      expect(response.config.params.email).toBeUndefined();
      expect(response.config.params.userId).toBeUndefined();
    });

    it('should paint an iframe to the DOM', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBe('IFRAME');
    });

    it('should remove the iframe when dismiss link is clicked', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="javascript:undefined"]'
      ) as Element;

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
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      expect(document.getElementById('iterable-iframe')?.tagName).toBe(
        'IFRAME'
      );
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      await document.dispatchEvent(escEvent);
      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should remove the iframe when overlay is clicked', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      expect(document.getElementById('iterable-iframe')?.tagName).toBe(
        'IFRAME'
      );

      const element = document.querySelector('[data-test-overlay]');

      const clickEvent = new MouseEvent('click');
      element?.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should paint next message to the DOM after 30s after first is dismissed', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="javascript:undefined"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);

      jest.advanceTimersByTime(32000);

      const secondCloseLink = (
        document.getElementById('iterable-iframe') as HTMLIFrameElement
      )?.contentWindow?.document.body?.querySelector(
        'a[href="action://close-second-iframe"]'
      );
      expect(secondCloseLink).not.toBe(null);
      expect(secondCloseLink).not.toBeUndefined();
    });

    it('should not paint next message to the DOM after 30s if queue is paused', async () => {
      const { request, pauseMessageStream } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="javascript:undefined"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      pauseMessageStream();
      jest.advanceTimersByTime(32000);

      expect(document.body.innerHTML).toBe('');
    });

    it('should paint next messsage to DOM if resumed', async () => {
      const { request, pauseMessageStream, resumeMessageStream } =
        getInAppMessages({ count: 10, packageName: 'my-lil-website' }, true);
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="javascript:undefined"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      pauseMessageStream();
      jest.advanceTimersByTime(32000);

      await resumeMessageStream();

      const secondCloseLink = (
        document.getElementById('iterable-iframe') as HTMLIFrameElement
      )?.contentWindow?.document.body?.querySelector(
        'a[href="action://close-second-iframe"]'
      );
      expect(secondCloseLink).not.toBe(null);
      expect(secondCloseLink).not.toBeUndefined();
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

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const mockOpen = jest.fn();
      global.open = mockOpen;

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

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

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

    it('should focus on element specified by user', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="google.com" /><input class="some-input" />'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        {
          count: 10,
          onOpenNodeToTakeFocus: 'input',
          packageName: 'my-lil-website'
        },
        true
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      const focusedElement = iframe?.contentWindow?.document
        ?.activeElement as Element;

      expect(focusedElement.tagName).toBe('INPUT');
    });

    it('should focus on first interactive element if no selector specified', async () => {
      mockRequest.onGet('/inApp/getMessages').reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="google.com" /><input class="some-input" />'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      const focusedElement = iframe?.contentWindow?.document
        ?.activeElement as Element;

      expect(focusedElement.tagName).toBe('A');
    });

    it('should track in app messages delivered', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      await request();

      expect(
        mockRequest.history.post.filter((e) =>
          e.url?.match(/trackInAppDelivery/gim)
        ).length
      ).toBe(3);
    });

    it('should not paint another message after 30 seconds if logged out', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        true
      );
      const { logout } = initIdentify('fdsafsd');
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="javascript:undefined"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);
      logout();

      jest.advanceTimersByTime(32000);

      const secondCloseLink = (
        document.getElementById('iterable-iframe') as HTMLIFrameElement
      )?.contentWindow?.document.body?.querySelector(
        'a[href="action://close-second-iframe"]'
      );
      expect(secondCloseLink).toBeUndefined();
    });
  });
});
