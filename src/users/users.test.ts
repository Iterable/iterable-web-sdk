import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import { updateUser, updateUserEmail } from './users';

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('Users Requests', () => {
  it('should set params and return the correct payload for updateUser', async () => {
    mockRequest.onPost('/users/update').reply(200, {
      msg: 'hello'
    });

    const response = await updateUser({
      preferUserId: true
    });

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
});
