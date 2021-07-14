import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppDelivery,
  trackInAppOpen
} from './events';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Events Requests', () => {
  it('return the correct payload for trackInAppClick', async () => {
    mockRequest.onPost('/events/trackInAppClick').reply(200, {
      msg: 'hello'
    });

    const response = await trackInAppClick({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppClose', async () => {
    mockRequest.onPost('/events/trackInAppClose').reply(200, {
      msg: 'hello'
    });

    const response = await trackInAppClose({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppConsume', async () => {
    mockRequest.onPost('/events/inAppConsume').reply(200, {
      msg: 'hello'
    });

    const response = await trackInAppConsume({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppDelivery', async () => {
    mockRequest.onPost('/events/trackInAppDelivery').reply(200, {
      msg: 'hello'
    });

    const response = await trackInAppDelivery({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for trackInAppOpen', async () => {
    mockRequest.onPost('/events/trackInAppOpen').reply(200, {
      msg: 'hello'
    });

    const response = await trackInAppOpen({ messageId: '123' });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(response.data.msg).toBe('hello');
  });
});
