import { BASE_URL, DEFAULT_EVENT_THRESHOLD_LIMIT } from '../constants';

export type IdentityResolution = {
  replayOnVisitorToKnown?: boolean;
  mergeOnUnknownToKnown?: boolean;
};

export type Options = {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  enableUnknownUserActivation: boolean;
  /**
   * @deprecated Use `enableUnknownUserActivation` instead. This alias is kept
   * for backward compatibility and will be removed in the next major version.
   */
  enableUnknownActivation?: boolean;
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
    enableUnknownUserActivation: false,
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
      const { enableUnknownActivation, ...rest } = newOptions;
      if (
        enableUnknownActivation !== undefined &&
        rest.enableUnknownUserActivation === undefined
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          '[Iterable] `enableUnknownActivation` is deprecated. Use `enableUnknownUserActivation` instead.'
        );
        rest.enableUnknownUserActivation = enableUnknownActivation;
      }
      options = {
        ...options,
        ...rest,
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
