/**
 * @jest-environment jsdom
 */
import MockAdapter from 'axios-mock-adapter';
import { initialize } from '../../authorization';
import { GETMESSAGES_PATH, SDK_VERSION, WEB_PLATFORM } from '../../constants';
import { baseAxiosRequest } from '../../request';
import { createClientError } from '../../utils/testUtils';
import { messages } from '../../__data__/inAppMessages';
import { getInAppMessages } from '../inapp';
import { DISPLAY_OPTIONS } from '../types';

jest.mock('../../utils/srSpeak', () => ({
  srSpeak: jest.fn()
}));

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('getInAppMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockRequest.resetHistory();

    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
      expect(response.config.params.SDKVersion).toBe(SDK_VERSION);
      expect(response.config.params.count).toBe(10);
      // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
      // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
    });

    it('should not paint an iframe to the DOM', async () => {
      await getInAppMessages({ count: 10, packageName: 'my-lil-website' });

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBeUndefined();
    });

    it('should wrap each message in an iframe', async () => {
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });

      response.data.inAppMessages.forEach((message) => {
        expect(message.content?.html).toBeInstanceOf(HTMLIFrameElement);
      });
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
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
        { display: DISPLAY_OPTIONS.immediate }
      ).request();

      expect(response.config.params.packageName).toBe('my-lil-website');
      expect(response.config.params.platform).toBe(WEB_PLATFORM);
      expect(response.config.params.count).toBe(10);
    });

    it('should reject if fails client-side validation', async () => {
      try {
        await getInAppMessages({} as any, {
          display: DISPLAY_OPTIONS.immediate
        }).request();
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
        { display: DISPLAY_OPTIONS.immediate }
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
        { display: DISPLAY_OPTIONS.immediate }
      ).request();

      expect(response.config.params.email).toBeUndefined();
      expect(response.config.params.userId).toBeUndefined();
    });

    it('should paint an iframe to the DOM if second argument is { display: "immediate" }', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBe('IFRAME');
    });

    it('should not paint an iframe to the DOM if second argument is { display: "deferred" }', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.deferred }
      );
      await request();

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBeUndefined();
    });

    it('should paint an iframe to the DOM if second argument is { display: "deferred" } and display fn is called', async () => {
      const { request, triggerDisplayMessages } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.deferred }
      );
      await request().then((response) =>
        triggerDisplayMessages(response.data.inAppMessages)
      );

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBe('IFRAME');
    });

    it('should paint an iframe to the DOM if second argument is { display: "nonsense" }', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: 'nonsense' as any }
      );
      await request();

      const element = document.getElementById('iterable-iframe');
      expect(element?.tagName).toBe('IFRAME');
    });

    it('should remove the iframe when dismiss link is clicked', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
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

    it('should remove the iframe when esc key is pressed within the iframe', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      expect(iframe?.tagName).toBe('IFRAME');
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      await iframe.contentWindow?.document.dispatchEvent(escEvent);
      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should remove the iframe when esc key is pressed within the document body', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
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
        { display: DISPLAY_OPTIONS.immediate }
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

    it('should remove the iframe when the custom close button is clicked', async () => {
      const { request } = getInAppMessages(
        {
          count: 10,
          packageName: 'my-lil-website',
          closeButton: {}
        },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const frame = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      expect(frame?.tagName).toBe('IFRAME');

      const element = document.body.querySelector(
        '[data-qa-custom-close-button]'
      );

      const clickEvent = new MouseEvent('click');
      element?.dispatchEvent(clickEvent);

      expect(document.getElementById('iterable-iframe')).toBe(null);
    });

    it('should paint next message to the DOM after 30s after first is dismissed', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
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
        { display: DISPLAY_OPTIONS.immediate }
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

      expect(document.body.innerHTML).toBe(
        '<button style="background: none; padding: 0px; cursor: unset; outline: inherit; height: 100vh; width: 100vw; position: fixed; top: 0px; left: 0px; z-index: -1;" tabindex="-1"></button>'
      );
    });

    it('should paint next message to DOM if resumed', async () => {
      const { request, pauseMessageStream, resumeMessageStream } =
        getInAppMessages(
          { count: 10, packageName: 'my-lil-website' },
          { display: DISPLAY_OPTIONS.immediate }
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

      await resumeMessageStream();

      const secondCloseLink = (
        document.getElementById('iterable-iframe') as HTMLIFrameElement
      )?.contentWindow?.document.body?.querySelector(
        'a[data-qa-original-link="action://close-second-iframe"]'
      );
      expect(secondCloseLink).not.toBe(null);
      expect(secondCloseLink).not.toBeUndefined();
    });

    it('should navigate offsite in a new tab if a clicked link has target _blank', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
        { display: DISPLAY_OPTIONS.immediate }
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
        'noopener,noreferrer'
      );
    });

    it('should navigate to site in same tab upon link click', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
      delete (global as any).location;
      global.location = {} as any;
      global.location.assign = mockRouteChange;

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
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

    it('should navigate to site in new tab if _handleLinks_ is "open-all-new-tab"', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="/relative-link" target="_blank" />'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        {
          count: 10,
          packageName: 'my-lil-website',
          handleLinks: 'open-all-new-tab'
        },
        { display: DISPLAY_OPTIONS.immediate }
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
        '/relative-link',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should navigate to site in same tab if _handleLinks_ is "open-all-same-tab"', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="http://google.com" target="_blank" />'
            }
          }
        ]
      });

      const mockRouteChange = jest.fn();
      delete (global as any).location;
      global.location = {} as any;
      global.location.assign = mockRouteChange;

      const { request } = getInAppMessages(
        {
          count: 10,
          packageName: 'my-lil-website',
          handleLinks: 'open-all-same-tab'
        },
        { display: DISPLAY_OPTIONS.immediate }
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

      expect(mockRouteChange).toHaveBeenCalledWith('http://google.com');
    });

    it('should navigate to site in new tab if _handleLinks_ is "external-new-tab" and is external link', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="http://google.com" target="_blank" /><a href="http://othersite.com" target="_blank" />'
            }
          }
        ]
      });

      const mockOpen = jest.fn();
      global.open = mockOpen;
      const mockRouteChange = jest.fn();
      delete (global as any).location;
      global.location = {} as any;
      global.location.assign = mockRouteChange;
      global.location.host = 'google.com';

      const { request } = getInAppMessages(
        {
          count: 10,
          packageName: 'my-lil-website',
          handleLinks: 'external-new-tab'
        },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;

      const elements =
        iframe?.contentWindow?.document.body?.querySelectorAll('a');

      const clickEvent = new MouseEvent('click');
      await elements?.[0].dispatchEvent(clickEvent);

      expect(mockRouteChange).toHaveBeenCalledWith('http://google.com');

      const clickEvent2 = new MouseEvent('click');
      await elements?.[1].dispatchEvent(clickEvent2);

      expect(mockOpen).toHaveBeenCalledWith(
        'http://othersite.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should focus on element specified by user', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
        { display: DISPLAY_OPTIONS.immediate }
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
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
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
        { display: DISPLAY_OPTIONS.immediate }
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
        { display: DISPLAY_OPTIONS.immediate }
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
        { display: DISPLAY_OPTIONS.immediate }
      );
      const { logout } = initialize('fdsafsd');
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

    it('should call global.postMessage when action:// link is clicked', async () => {
      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const mockHandler = jest.fn();
      global.postMessage = mockHandler;

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[data-qa-original-link="action://close-first-iframe"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(mockHandler).toHaveBeenCalledWith(
        {
          data: 'close-first-iframe',
          type: 'iterable-action-link'
        },
        '*'
      );
      expect(document.getElementById('iterable-iframe')).toBe(null);
      expect(
        JSON.parse(
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )[0].data
        ).clickedUrl
      ).toBe('action://close-first-iframe');
    });

    it('should do nothing upon clicking itbl:// links', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="itbl://whatever">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="itbl://whatever"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(document.getElementById('iterable-iframe')).not.toBe(null);
      expect(document.getElementById('iterable-iframe')).not.toBeUndefined();
    });

    it('should do nothing upon clicking itbl://dismiss links', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="itbl://dismiss">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="itbl://dismiss"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(document.getElementById('iterable-iframe')).not.toBe(null);
      expect(document.getElementById('iterable-iframe')).not.toBeUndefined();
    });

    it('should do nothing upon clicking iterable:// non-dismiss links', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="iterable://whatever">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://whatever"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(document.getElementById('iterable-iframe')).not.toBe(null);
      expect(document.getElementById('iterable-iframe')).not.toBeUndefined();
    });

    it('should call /trackInAppClick with sendBeacon if linking in same tab', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a href="/about">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="/about"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(
        mockRequest.history.post.filter((e) => !!e.url?.match(/InAppClick/gim))
          .length
      ).toBe(1);
      expect(
        (
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )?.[0] as any
        )?.sendBeacon
      ).toBeTruthy();
    });

    it('should call /trackInAppClick without sendBeacon if linking in new tab', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a target="_blank" href="/about">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="/about"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(
        mockRequest.history.post.filter((e) => !!e.url?.match(/InAppClick/gim))
          .length
      ).toBe(1);
      expect(
        (
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )?.[0] as any
        )?.sendBeacon
      ).toBeFalsy();
    });

    it('should call /trackInAppClick with sendBeacon if linking in same tab due to handleLinks', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a target="_blank" href="/about">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        {
          count: 10,
          packageName: 'my-lil-website',
          handleLinks: 'open-all-same-tab'
        },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="/about"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(
        mockRequest.history.post.filter((e) => !!e.url?.match(/InAppClick/gim))
          .length
      ).toBe(1);
      expect(
        (
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )?.[0] as any
        )?.sendBeacon
      ).toBeTruthy();
    });

    it('should call /trackInAppClick without sendBeacon if clicking iterable://hi link', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a target="_blank" href="iterable://hi">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
      );
      await request();

      const iframe = document.getElementById(
        'iterable-iframe'
      ) as HTMLIFrameElement;
      const element = iframe?.contentWindow?.document.body?.querySelector(
        'a[href="iterable://hi"]'
      ) as Element;

      const clickEvent = new MouseEvent('click');
      await element.dispatchEvent(clickEvent);
      expect(
        mockRequest.history.post.filter((e) => !!e.url?.match(/InAppClick/gim))
          .length
      ).toBe(1);
      expect(
        (
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )?.[0] as any
        )?.sendBeacon
      ).toBeFalsy();
    });

    it('should call /trackInAppClick without sendBeacon if clicking action:// link', async () => {
      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        inAppMessages: [
          {
            ...messages[0],
            content: {
              ...messages[0].content,
              html: '<a target="_blank" href="action://hi">profile</a>'
            }
          }
        ]
      });

      const { request } = getInAppMessages(
        { count: 10, packageName: 'my-lil-website' },
        { display: DISPLAY_OPTIONS.immediate }
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
      expect(
        mockRequest.history.post.filter((e) => !!e.url?.match(/InAppClick/gim))
          .length
      ).toBe(1);
      expect(
        (
          mockRequest.history.post.filter(
            (e) => !!e.url?.match(/InAppClick/gim)
          )?.[0] as any
        )?.sendBeacon
      ).toBeFalsy();
    });
  });
});
