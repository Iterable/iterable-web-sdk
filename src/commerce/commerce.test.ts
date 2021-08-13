import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { trackPurchase, updateCart } from './commerce';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Users Requests', () => {
  it('should set params and return the correct payload for updateCart', async () => {
    mockRequest.onPost('/commerce/updateCart').reply(200, {
      msg: 'hello'
    });

    const response = await updateCart({
      items: []
    });

    expect(JSON.parse(response.config.data).items).toEqual([]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
    expect(response.data.msg).toBe('hello');
  });

  it('should set params and return the correct payload for trackPurchase', async () => {
    mockRequest.onPost('/commerce/trackPurchase').reply(200, {
      msg: 'hello'
    });

    const response = await trackPurchase({ items: [], total: 100 });

    expect(JSON.parse(response.config.data).total).toBe(100);
    expect(JSON.parse(response.config.data).items).toEqual([]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
    expect(response.data.msg).toBe('hello');
  });

  it('should not allow a passed userId or email for API methods', async () => {
    mockRequest.onPost('/commerce/trackPurchase').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/commerce/updateCart').reply(200, {
      msg: 'hello'
    });

    const updateResponse = await updateCart({
      user: {
        email: 'hello@gmail.com',
        userId: '1234'
      }
    } as any);
    const trackResponse = await trackPurchase({
      user: {
        email: 'hello@gmail.com',
        userId: '1234'
      }
    } as any);

    expect(JSON.parse(updateResponse.config.data).user.email).toBeUndefined();
    expect(JSON.parse(updateResponse.config.data).user.userId).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).user.email).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).user.userId).toBeUndefined();
  });
});
