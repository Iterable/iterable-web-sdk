import { BASE_URL } from '../constants';

interface Options {
  logLevel: 'none' | 'verbose';
  baseURL: string;
}

const _config = () => {
  let options: Options = {
    logLevel: 'none',
    baseURL: BASE_URL
  };

  return {
    getConfig: (option: keyof Options) => options[option],
    setConfig: (newOptions: Partial<Options>) => {
      options = {
        ...options,
        ...newOptions
      };
    }
  };
};

export const config = _config();

export default config;
