import { BASE_URL } from '../constants';

interface Options {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  enableAnonTracking: boolean;
}

const _config = () => {
  let options: Options = {
    logLevel: 'none',
    baseURL: BASE_URL,
    enableAnonTracking: false
  };

  return {
    getConfig: <K extends keyof Options>(option: K) => options[option],
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
