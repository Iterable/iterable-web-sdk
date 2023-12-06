import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import {
  track,
  trackEmbeddedMessageReceived,
  trackEmbeddedMessageClick,
  trackEmbeddedSession
} from './events';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppDelivery,
  trackInAppOpen
} from './in-app/events';
import { WEB_PLATFORM } from '../constants';
import { createClientError } from '../utils/testUtils';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Events Requests', () => {
  beforeAll(() => {
    mockRequest.onPost('/events/track').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppClick').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppClose').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/inAppConsume').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppDelivery').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppOpen').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/received').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/click').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/impression').reply(200, {
      msg: 'hello'
    });
  });

  it('return the correct payload for track', async () => {
    const response = await track({ eventName: 'test' });

    expect(JSON.parse(response.config.data).eventName).toBe('test');
    expect(response.data.msg).toBe('hello');
  });

  it('should reject track on bad params', async () => {
    try {
      await track({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'eventName is a required field',
            field: 'eventName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppClick', async () => {
    const response = await trackInAppClick({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
  });

  it('should reject trackInAppClick on bad params', async () => {
    try {
      await trackInAppClick({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppClose', async () => {
    const response = await trackInAppClose({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppClose on bad params', async () => {
    try {
      await trackInAppClose({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppConsume', async () => {
    const response = await trackInAppConsume({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppConsume on bad params', async () => {
    try {
      await trackInAppConsume({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppDelivery', async () => {
    const response = await trackInAppDelivery({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppDelivery on bad params', async () => {
    try {
      await trackInAppDelivery({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppOpen', async () => {
    const response = await trackInAppOpen({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppOpen on bad params', async () => {
    try {
      await trackInAppOpen({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for embedded message received', async () => {
    const payload = {
      messageId: 'abc123',
      metadata: {
        messageId: 'abc123',
        campaignId: 1
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!'
      },
      deviceInfo: { appPackageName: 'my-lil-site' }
    };
    const response = await trackEmbeddedMessageReceived(payload);

    const result =
      JSON.parse(response.config.data)?.elements?.title ===
      payload.elements.title;

    expect(result).toBe(true);
  });

  it('should reject embedded message received on bad params', async () => {
    try {
      await trackEmbeddedMessageReceived({} as any);
    } catch (e: any) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for embedded message click', async () => {
    const payload = {
      messageId: 'abc123',
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';
    const response = await trackEmbeddedMessageClick(
      'abc123',
      payload,
      buttonIdentifier,
      clickedUrl,
      appPackageName,
      0
    );

    expect(JSON.parse(response.config.data).messageId).toBe('abc123');
  });

  it('should reject embedded message click on bad params', async () => {
    try {
      await trackEmbeddedMessageClick('', {} as any, '', '', '', 0);
    } catch (e: any) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for embedded message received', async () => {
    const payload = {
      session: {
        id: '123',
        start: 18686876876876,
        end: 1008083828723
      },
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10,
          displayDuration: 10
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8,
          displayDuration: 8
        }
      ],
      deviceInfo: { appPackageName: 'my-lil-site' }
    };
    const response = await trackEmbeddedSession(payload);

    expect(JSON.parse(response.config.data).session.id).toBe('123');
  });

  it('should reject embedded message received on bad params', async () => {
    try {
      await trackEmbeddedSession({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('should not send up passed email or userId params', async () => {
    const trackResponse = await track({
      email: 'hello@gmail.com',
      userId: '1234',
      eventName: 'my-event',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackClickResponse = await trackInAppClick({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackCloseResponse = await trackInAppClose({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackConsumeResponse = await trackInAppConsume({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackDeliveryResponse = await trackInAppDelivery({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackOpenResponse = await trackInAppOpen({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackEmMsgRecvdResponse = await trackEmbeddedMessageReceived({
      messageId: 'abc123',
      metadata: {
        messageId: 'abc123',
        campaignId: 1
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!'
      },
      deviceInfo: { appPackageName: 'my-lil-site' }
    });
    const trackEmClickResponse = await trackEmbeddedMessageClick(
      'abc123',
      {
        messageId: 'abc123',
        campaignId: 1
      },
      'button-123',
      'https://example.com',
      'my-lil-site',
      0
    );
    const trackSessionResponse = await trackEmbeddedSession({
      session: {
        id: '123',
        start: 18686876876876,
        end: 1008083828723
      },
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10,
          displayDuration: 10
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8,
          displayDuration: 8
        }
      ],
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);

    expect(JSON.parse(trackResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');

    expect(JSON.parse(trackClickResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackClickResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackClickResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackClickResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(JSON.parse(trackCloseResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackCloseResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackCloseResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackCloseResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(JSON.parse(trackConsumeResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackConsumeResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackConsumeResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(
      JSON.parse(trackConsumeResponse.config.data).deviceInfo.platform
    ).toBe(WEB_PLATFORM);

    expect(JSON.parse(trackDeliveryResponse.config.data).email).toBeUndefined();
    expect(
      JSON.parse(trackDeliveryResponse.config.data).userId
    ).toBeUndefined();
    expect(
      JSON.parse(trackDeliveryResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(
      JSON.parse(trackDeliveryResponse.config.data).deviceInfo.platform
    ).toBe(WEB_PLATFORM);

    expect(JSON.parse(trackOpenResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackOpenResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackOpenResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackOpenResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(
      JSON.parse(trackEmMsgRecvdResponse.config.data).email
    ).toBeUndefined();
    expect(
      JSON.parse(trackEmMsgRecvdResponse.config.data).userId
    ).toBeUndefined();

    expect(JSON.parse(trackEmClickResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackEmClickResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackSessionResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackSessionResponse.config.data).userId).toBeUndefined();
  });
});
