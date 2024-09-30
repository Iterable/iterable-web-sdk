import { BASE_URL, DEFAULT_EVENT_THRESHOLD_LIMIT } from '../constants';

type IdentityResolution = {
  replayOnVisitorToKnown?: boolean;
  mergeOnAnonymousToKnown?: boolean;
};

export type Options = {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  enableAnonTracking: boolean;
  isEuIterableService: boolean;
  dangerouslyAllowJsPopups: boolean;
  eventThresholdLimit?: number;
  identityResolution?: IdentityResolution;
  onAnonUserCreated?: (userId: string) => void;
};

const _config = () => {
  let options: Options = {
    logLevel: 'none',
    baseURL: BASE_URL,
    enableAnonTracking: false,
    isEuIterableService: false,
    dangerouslyAllowJsPopups: false,
    eventThresholdLimit: DEFAULT_EVENT_THRESHOLD_LIMIT,
    identityResolution: {
      replayOnVisitorToKnown: true,
      mergeOnAnonymousToKnown: true
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
