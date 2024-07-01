import { BASE_URL } from '../constants';

export type Options = {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  enableAnonTracking: boolean;
  isEuIterableService: boolean;
  dangerouslyAllowJsPopups: boolean;
};

const _config = () => {
  let options: Options = {
    logLevel: 'none',
    baseURL: BASE_URL,
    enableAnonTracking: false,
    isEuIterableService: false,
    dangerouslyAllowJsPopups: false
  };

  const getConfig = <K extends keyof Options>(option: K) => options[option];

  return {
    getConfig,
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
