import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { trackPurchase, updateCart } from './commerce';
import { SDK_VERSION, WEB_PLATFORM } from '../constants';
import { createClientError } from '../utils/testUtils';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Users Requests', () => {
  it('should set params and return the correct payload for updateCart', async () => {
    mockRequest.onPost('/commerce/updateCart').reply(200, {
      msg: 'hello'
    });

    const response = await updateCart({
      items: [
        {
          id: 'fdsafds',
          name: 'banana',
          quantity: 2,
          price: 12
        }
      ]
    });

    expect(JSON.parse(response.config.data).items).toEqual([
      {
        id: 'fdsafds',
        name: 'banana',
        quantity: 2,
        price: 12
      }
    ]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
    expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
    expect(response.data.msg).toBe('hello');
  });

  it('should reject updateCart on bad params', async () => {
    try {
      await updateCart({
        items: [{} as any]
      });
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'items[0].id is a required field',
            field: 'items[0].id'
          },
          {
            error: 'items[0].name is a required field',
            field: 'items[0].name'
          },
          {
            error: 'items[0].price is a required field',
            field: 'items[0].price'
          },
          {
            error: 'items[0].quantity is a required field',
            field: 'items[0].quantity'
          }
        ])
      );
    }
  });

  it('should set params and return the correct payload for trackPurchase', async () => {
    mockRequest.onPost('/commerce/trackPurchase').reply(200, {
      msg: 'hello'
    });

    const response = await trackPurchase({
      items: [],
      total: 100
    });

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
      },
      items: []
    } as any);
    const trackResponse = await trackPurchase({
      user: {
        email: 'hello@gmail.com',
        userId: '1234'
      },
      items: [],
      total: 100
    } as any);

    expect(JSON.parse(updateResponse.config.data).user.email).toBeUndefined();
    expect(JSON.parse(updateResponse.config.data).user.userId).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).user.email).toBeUndefined();
    expect(JSON.parse(trackResponse.config.data).user.userId).toBeUndefined();
  });

  it('should reject updateCart on bad params', async () => {
    try {
      await trackPurchase({
        items: [{} as any]
      } as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'items[0].id is a required field',
            field: 'items[0].id'
          },
          {
            error: 'items[0].name is a required field',
            field: 'items[0].name'
          },
          {
            error: 'items[0].price is a required field',
            field: 'items[0].price'
          },
          {
            error: 'items[0].quantity is a required field',
            field: 'items[0].quantity'
          },
          {
            error: 'total is a required field',
            field: 'total'
          }
        ])
      );
    }
  });
});
