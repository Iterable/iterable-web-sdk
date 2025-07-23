import { BASE_URL, DEFAULT_EVENT_THRESHOLD_LIMIT } from '../constants';

export type IdentityResolution = {
  replayOnVisitorToKnown?: boolean;
  mergeOnUnknownToKnown?: boolean;
};

export type Options = {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  enableUnknownActivation: boolean;
  isEuIterableService: boolean;
  dangerouslyAllowJsPopups: boolean;
  eventThresholdLimit?: number;
  onUnknownUserCreated?: (userId: string) => void;
  identityResolution?: IdentityResolution;
};

const _config = () => {
  let options: Options = {
    logLevel: 'none',
    baseURL: BASE_URL,
    enableUnknownActivation: false,
    isEuIterableService: false,
    dangerouslyAllowJsPopups: false,
    eventThresholdLimit: DEFAULT_EVENT_THRESHOLD_LIMIT,
    identityResolution: {
      replayOnVisitorToKnown: true,
      mergeOnUnknownToKnown: true
    }
  };

  const getConfig = <K extends keyof Options>(option: K) => options[option];

  return {
    getConfig,
    setConfig: (newOptions: Partial<Options>) => {
      options = {
        ...options,
        ...newOptions,
        identityResolution: {
          ...options.identityResolution,
          ...newOptions.identityResolution
        }
      };
    }
  };
};

export const config = _config();

export default config;
