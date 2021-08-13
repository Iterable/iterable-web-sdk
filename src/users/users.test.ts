import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { updateSubscriptions, updateUser, updateUserEmail } from './users';

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
    expect(response.data.msg).toBe('hello');
  });

  it('should set params and return the correct payload for updateUserEmail', async () => {
    mockRequest.onPost('/users/updateEmail').reply(200, {
      msg: 'hello'
    });

    const response = await updateUserEmail('hello@gmail.com');

    expect(JSON.parse(response.config.data).newEmail).toBe('hello@gmail.com');
    expect(response.data.msg).toBe('hello');
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
  });
});
