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

  it('return the correct payload for trackInAppClick', async () => {
    const response = await track({ eventName: 'test' });

    expect(JSON.parse(response.config.data).eventName).toBe('test');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppClick', async () => {
    const response = await trackInAppClick({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppClose', async () => {
    const response = await trackInAppClose({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppConsume', async () => {
    const response = await trackInAppConsume({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppDelivery', async () => {
    const response = await trackInAppDelivery({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppOpen', async () => {
    const response = await trackInAppOpen({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('should not send up passed email or userId params', async () => {
    const trackResponse = await track({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const trackClickResponse = await trackInAppClick({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const trackCloseResponse = await trackInAppClose({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const trackConsumeResponse = await trackInAppConsume({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const trackDeliveryResponse = await trackInAppDelivery({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const trackOpenResponse = await trackInAppOpen({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);

    expect(JSON.parse(trackResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackClickResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackClickResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackCloseResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackCloseResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackConsumeResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackConsumeResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackDeliveryResponse.config.data).email).toBeUndefined();
    expect(
      JSON.parse(trackDeliveryResponse.config.data).userId
    ).toBeUndefined();

    expect(JSON.parse(trackOpenResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackOpenResponse.config.data).userId).toBeUndefined();
  });
});
