import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import {
  track,
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppDelivery,
  trackInAppOpen
} from './events';
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
  });

  it('return the correct payload for track', async () => {
    const response = await track({ eventName: 'test' });

    expect(JSON.parse(response.config.data).eventName).toBe('test');
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
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
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
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
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
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
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
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
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
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

    expect(JSON.parse(trackResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');

    expect(JSON.parse(trackClickResponse.config.data).email).toEqual(
      'hello@gmail.com'
    );
    expect(JSON.parse(trackClickResponse.config.data).userId).toEqual('1234');
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
  });
});
