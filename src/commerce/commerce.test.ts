import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { trackPurchase, updateCart } from './commerce';
import { createClientError } from '../utils/testUtils';
import { config } from '../utils/config';

const mockRequest = new MockAdapter(baseAxiosRequest);

jest.mock('../utils/anonymousUserEventManager', () => {
  return {
    AnonymousUserEventManager: jest.fn().mockImplementation(() => ({
      trackAnonUpdateCart: jest.fn(),
      trackAnonPurchaseEvent: jest.fn()
    }))
  };
});

describe('Users Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.setConfig({ enableAnonTracking: true });
  });

  it('should throw an error if updateCart payload is empty', () => {
    expect(() => {
      updateCart({} as any);
    }).toThrow();
  });

  it('should throw an error if updateCart userId is empty', () => {
    expect(() => {
      updateCart({
        items: [
          {
            id: 'fdsafds',
            name: 'banana',
            quantity: 2,
            price: 12
          }
        ]
      });
    }).toThrow();
  });

  it('return the correct payload for updateCart with userId', async () => {
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
      ],
      user: {
        userId: 'user'
      }
    });
    expect(response.data.msg).toBe('hello');
  });

  it('return the correct payload for updateCart with email', async () => {
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
      ],
      user: {
        email: 'user@example.com'
      }
    });
    expect(response.data.msg).toBe('hello');
    expect(JSON.parse(response.config.data).items).toEqual([
      {
        id: 'fdsafds',
        name: 'banana',
        quantity: 2,
        price: 12
      }
    ]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
  });

  it('should reject updateCart on bad params', async () => {
    try {
      await updateCart({
        items: [{} as any],
        user: {
          userId: 'user'
        }
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

  it('should throw an error if trackPurchase payload is empty', () => {
    expect(() => {
      trackPurchase({} as any);
    }).toThrow();
  });

  it('should throw an error if trackPurchase userId is empty', () => {
    expect(() => {
      trackPurchase({
        items: [],
        total: 100
      });
    }).toThrow();
  });

  it('return the correct payload for trackPurchase with userId', async () => {
    mockRequest.onPost('/commerce/trackPurchase').reply(200, {
      msg: 'hello'
    });

    const response = await trackPurchase({
      items: [
        {
          id: 'fdsafds',
          name: 'banana',
          quantity: 2,
          price: 12
        }
      ],
      user: {
        userId: 'user'
      },
      total: 24
    });
    expect(response.data.msg).toBe('hello');
    expect(JSON.parse(response.config.data).total).toBe(24);
    expect(JSON.parse(response.config.data).items).toEqual([
      {
        id: 'fdsafds',
        name: 'banana',
        quantity: 2,
        price: 12
      }
    ]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
  });

  it('return the correct payload for trackPurchase with email', async () => {
    mockRequest.onPost('/commerce/trackPurchase').reply(200, {
      msg: 'hello'
    });

    const response = await trackPurchase({
      items: [
        {
          id: 'fdsafds',
          name: 'banana',
          quantity: 2,
          price: 12
        }
      ],
      user: {
        email: 'user@example.com'
      },
      total: 24
    });
    expect(response.data.msg).toBe('hello');
    expect(JSON.parse(response.config.data).total).toBe(24);
    expect(JSON.parse(response.config.data).items).toEqual([
      {
        id: 'fdsafds',
        name: 'banana',
        quantity: 2,
        price: 12
      }
    ]);
    expect(JSON.parse(response.config.data).user.preferUserId).toBe(true);
  });

  it('should reject trackPurchase on bad params', async () => {
    try {
      await trackPurchase({
        items: [{} as any],
        user: {
          userId: 'user'
        }
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
