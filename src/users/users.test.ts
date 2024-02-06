import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { updateSubscriptions, updateUser, updateUserEmail } from './users';
import { createClientError } from '../utils/testUtils';
// import { SDK_VERSION, WEB_PLATFORM } from '../constants';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Users Requests', () => {
  it('should set params and return the correct payload for updateUser', async () => {
    mockRequest.onPost('/users/update').reply(200, {
      msg: 'hello'
    });

    const response = await updateUser({
      dataFields: {}
    });

    expect(JSON.parse(response.config.data).dataFields).toEqual({});
    expect(JSON.parse(response.config.data).preferUserId).toBe(true);
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
    expect(response.data.msg).toBe('hello');
  });

  // it('should reject updateUser on bad params', async () => {
  //   try {
  //     await updateUser({
  //       dataFields: 'string',
  //       preferUserId: 'string',
  //       mergeNestedObjects: 'string'
  //     } as any);
  //   } catch (e) {
  //     expect(e).toEqual(
  //       createClientError([
  //         {
  //           error:
  //             'dataFields must be a `object` type, but the final value was: `null` (cast from the value `"string"`).\n' +
  //             ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
  //           field: 'dataFields'
  //         },
  //         {
  //           error:
  //             'mergeNestedObjects must be a `boolean` type, but the final value was: `"string"`.',
  //           field: 'mergeNestedObjects'
  //         }
  //       ])
  //     );
  //   }
  // });

  it('should set params and return the correct payload for updateUserEmail', async () => {
    mockRequest.onPost('/users/updateEmail').reply(200, {
      msg: 'hello'
    });

    const response = await updateUserEmail('hello@gmail.com');

    expect(JSON.parse(response.config.data).newEmail).toBe('hello@gmail.com');
    expect(response.data.msg).toBe('hello');
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
  });

  it('should reject updateUserEmail on bad params', async () => {
    try {
      await updateUserEmail(null as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error:
              'newEmail must be a `string` type, but the final value was: `null`.\n' +
              ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            field: 'newEmail'
          }
        ])
      );
    }
  });

  it('should set params and return the correct payload for updateSubscriptions', async () => {
    mockRequest.onPost('/users/updateSubscriptions').reply(200, {
      msg: 'hello'
    });

    const response = await updateSubscriptions({
      emailListIds: [55],
      subscribedMessageTypeIds: [1],
      unsubscribedChannelIds: [3],
      unsubscribedMessageTypeIds: [4],
      campaignId: 5,
      templateId: 556
    });

    expect(JSON.parse(response.config.data).emailListIds).toEqual([55]);
    expect(JSON.parse(response.config.data).subscribedMessageTypeIds).toEqual([
      1
    ]);
    expect(JSON.parse(response.config.data).unsubscribedChannelIds).toEqual([
      3
    ]);
    expect(JSON.parse(response.config.data).unsubscribedMessageTypeIds).toEqual(
      [4]
    );
    expect(JSON.parse(response.config.data).campaignId).toBe(5);
    expect(JSON.parse(response.config.data).templateId).toBe(556);
    expect(response.data.msg).toBe('hello');
    // expect(response.config.headers['SDK-Version']).toBe(SDK_VERSION);
    // expect(response.config.headers['SDK-Platform']).toBe(WEB_PLATFORM);
  });

  it('should reject updateSubscriptions on bad params', async () => {
    try {
      await updateSubscriptions({
        emailListIds: 'string',
        unsubscribedChannelIds: 'string',
        unsubscribedMessageTypeIds: 'string',
        subscribedMessageTypeIds: 'string',
        campaignId: 'string',
        templateId: 'string'
      } as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error:
              'emailListIds must be a `array` type, but the final value was: `null` (cast from the value `"string"`).\n' +
              ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            field: 'emailListIds'
          },
          {
            error:
              'unsubscribedChannelIds must be a `array` type, but the final value was: `null` (cast from the value `"string"`).\n' +
              ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            field: 'unsubscribedChannelIds'
          },
          {
            error:
              'unsubscribedMessageTypeIds must be a `array` type, but the final value was: `null` (cast from the value `"string"`).\n' +
              ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            field: 'unsubscribedMessageTypeIds'
          },
          {
            error:
              'subscribedMessageTypeIds must be a `array` type, but the final value was: `null` (cast from the value `"string"`).\n' +
              ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            field: 'subscribedMessageTypeIds'
          },
          {
            error:
              'campaignId must be a `number` type, but the final value was: `NaN` (cast from the value `"string"`).',
            field: 'campaignId'
          },
          {
            error:
              'templateId must be a `number` type, but the final value was: `NaN` (cast from the value `"string"`).',
            field: 'templateId'
          }
        ])
      );
    }
  });

  it('should not allow a passed userId or email for API methods', async () => {
    mockRequest.onPost('/users/updateSubscriptions').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/users/update').reply(200, {
      msg: 'hello'
    });

    const updateResponse = await updateUser({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);
    const subsResponse = await updateSubscriptions({
      email: 'hello@gmail.com',
      userId: '1234'
    } as any);

    expect(JSON.parse(updateResponse.config.data).email).toEqual(
      'hello@gmail.com'
    );
    expect(JSON.parse(updateResponse.config.data).userId).toEqual('1234');
    expect(JSON.parse(subsResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(subsResponse.config.data).userId).toBeUndefined();
  });
});
