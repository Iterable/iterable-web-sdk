import { baseRequest } from 'src/request';

export const getChannels = () =>
  baseRequest({
    method: 'GET',
    url: '/api/channels'
  });
