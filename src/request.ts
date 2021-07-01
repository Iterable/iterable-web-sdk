import Axios from 'axios';

export const baseRequest = Axios.create({
  baseURL: 'https://api.iterable.com'
});
