/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-redeclare */
import axios from 'axios';
import {
  ENDPOINTS,
  IS_PRODUCTION,
  RETRY_USER_ATTEMPTS,
  RouteConfig,
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID,
  STATIC_HEADERS
} from '../constants';
import { clearMessages } from '../inapp';
import { baseAxiosRequest } from '../request';
import { updateUser } from '../users';
import { config, Options } from '../utils/config';
import {
  cancelAxiosRequestAndMakeFetch,
  getEpochDifferenceInMS,
  getEpochExpiryTimeInMS,
  isEmail,
  ONE_DAY,
  ONE_MINUTE,
  validateTokenTime
} from './utils';

const MAX_TIMEOUT = ONE_DAY;

export interface GenerateJWTPayload {
  email?: string;
  userID?: string;
}

export interface WithJWT {
  setEmail: (email: string) => Promise<string>;
  setUserID: (userId: string) => Promise<string>;
  logout: () => void;
  refreshJwtToken: (authTypes: string) => Promise<string>;
  clearRefresh: () => void;
}

export interface WithoutJWT {
  setEmail: (email: string) => void;
  setUserID: (userId: string) => Promise<void>;
  logout: () => void;
  setNewAuthToken: (newToken?: string) => void;
  clearAuthToken: () => void;
}

const doesRequestUrlContain = (routeConfig: RouteConfig) =>
  Object.entries(ENDPOINTS).some(
    (entry) =>
      routeConfig.route === entry[1].route &&
      routeConfig.body === entry[1].body &&
      routeConfig.current === entry[1].current &&
      routeConfig.nestedUser === entry[1].nestedUser
  );

const setAuthInterceptor = (
  authInterceptor: number | null,
  authToken: string
) => {
  if (typeof authInterceptor === 'number') {
    /** Clear previously cached interceptor function */
    baseAxiosRequest.interceptors.request.eject(authInterceptor);
  }

  /** Set auth token to interceptor for all requests */
  return baseAxiosRequest.interceptors.request.use((config) => {
    config.headers.set('Api-Key', authToken);
    return config;
  });
};

export function initialize(
  authToken: string,
  generateJWT: (payload: GenerateJWTPayload) => Promise<string>
): WithJWT;
export function initialize(authToken: string): WithoutJWT;
export function initialize(
  authToken: string,
  generateJWT?: (payload: GenerateJWTPayload) => Promise<string>
) {
  const logLevel = config.getConfig('logLevel');
  if (!generateJWT && IS_PRODUCTION) {
    /* only let people use non-JWT mode if running the app locally */
    if (logLevel === 'verbose') {
      return console.error(
        'Please provide a Promise method for generating a JWT token.'
      );
    }
    return null;
  }

  /*
    only set token interceptor if we're using a non-JWT key.
    Otherwise, we'll set it later once we generate the JWT
  */
  let authInterceptor: number | null = generateJWT
    ? null
    : setAuthInterceptor(null, authToken);
  let userInterceptor: number | null = null;
  let responseInterceptor: number | null = null;
  /*
    AKA did the user auth with their email (setEmail) or user ID (setUserID)

    we're going to use this variable for one circumstance - when calling _updateUserEmail_.
    Essentially, when we call the Iterable API to update a user's email address and we get a
    successful 200 request, we're going to request a new JWT token, since it might need to
    be re-signed with the new email address; however, if the customer code never authorized the
    user with an email and instead a user ID, we'll just continue to sign the JWT with the user ID.

    This is mainly just a quality-of-life feature, so that the customer's JWT generation code
    doesn't _need_ to support email-signed JWTs if they don't want and purely want to issue the
    tokens by user ID.
  */
  let typeOfAuth: null | 'email' | 'userID' = null;
  /* this will be the literal user ID or email they choose to auth with */
  let authIdentifier: null | string = null;

  /**
    method that sets a timer one minute before JWT expiration

    @param { string } jwt - JWT token to decode
    @param { (...args: any ) => Promise<any> } callback - promise to invoke before expiry
  */
  const createTokenExpirationTimer = () => {
    let timer: NodeJS.Timeout | null;

    // eslint-disable-next-line consistent-return
    return (jwt: string, callback?: (...args: any) => Promise<any>) => {
      if (timer) {
        /* clear existing timeout on JWT refresh */
        clearTimeout(timer);
        timer = null;
      }

      if (callback) {
        const expTime = getEpochExpiryTimeInMS(jwt);
        const millisecondsToExpired = getEpochDifferenceInMS(
          Date.now(),
          expTime
        );
        if (validateTokenTime(millisecondsToExpired)) {
          return console.warn(
            'Could not refresh JWT. Try generating the token again.'
          );
        }

        if (millisecondsToExpired < MAX_TIMEOUT) {
          timer = setTimeout(
            () =>
              /* get new token */
              callback().catch((e: any) => {
                console.warn(e);
                console.warn(
                  'Could not refresh JWT. Try identifying the user again.'
                );
              }),
            /* try to refresh one minute until expiry */
            millisecondsToExpired - ONE_MINUTE
          );
        }
      }
    };
  };

  const handleTokenExpiration = createTokenExpirationTimer();

  const addEmailToRequest = (email: string) => {
    userInterceptor = baseAxiosRequest.interceptors.request.use((config) => {
      /*
        endpoints that use _currentEmail_ payload prop in POST/PUT requests
      */
      if (
        doesRequestUrlContain({
          route: config?.url ?? '',
          body: true,
          current: true,
          nestedUser: true
        })
      ) {
        return {
          ...config,
          data: {
            ...(config.data || {}),
            currentEmail: email
          }
        };
      }

      /*
        endpoints that use _email_ payload prop in POST/PUT requests
      */
      if (
        doesRequestUrlContain({
          route: config?.url ?? '',
          body: true,
          current: false,
          nestedUser: false
        })
      ) {
        return {
          ...config,
          data: {
            ...(config.data || {}),
            email
          }
        };
      }

      /*
        endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
      */
      if (
        doesRequestUrlContain({
          route: config?.url ?? '',
          body: true,
          current: false,
          nestedUser: true
        })
      ) {
        return {
          ...config,
          data: {
            ...(config.data || {}),
            user: {
              ...(config.data.user || {}),
              email
            }
          }
        };
      }

      /*
        endpoints that use _email_ query param in GET requests
      */

      if (
        doesRequestUrlContain({
          route: config?.url ?? '',
          body: false,
          current: false,
          nestedUser: false
        })
      ) {
        return {
          ...config,
          params: {
            ...(config.params || {}),
            email
          }
        };
      }

      return config;
    });
  };

  if (!generateJWT) {
    /* we want to set a normal non-JWT enabled API key */
    return {
      setNewAuthToken: (newToken: string) => {
        if (typeof authInterceptor === 'number') {
          /* clear previously cached interceptor function */
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }
        authInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => {
            config.headers.set('Api-Key', newToken);
            return config;
          }
        );
      },
      clearAuthToken: () => {
        /* might be 0 which is a falsy value */
        if (typeof authInterceptor === 'number') {
          /* clear previously cached interceptor function */
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }
      },
      setEmail: (email: string) => {
        typeOfAuth = 'email';
        authIdentifier = email;
        localStorage.setItem(SHARED_PREF_EMAIL, email);
        clearMessages();

        authInterceptor = setAuthInterceptor(authInterceptor, authToken);

        if (typeof userInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }

        /*
          endpoints that use _currentEmail_ payload prop in POST/PUT requests
        */
        addEmailToRequest(email);
      },
      setUserID: async (userId: string) => {
        typeOfAuth = 'userID';
        authIdentifier = userId;
        localStorage.setItem(SHARED_PREF_USER_ID, userId);
        clearMessages();

        authInterceptor = setAuthInterceptor(authInterceptor, authToken);

        if (typeof userInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }

        /*
          endpoints that use _currentUserId payload prop in POST/PUT requests nested in { user: {} }
        */
        userInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => {
            if (
              doesRequestUrlContain({
                route: config?.url ?? '',
                body: true,
                current: true,
                nestedUser: true
              })
            ) {
              return {
                ...config,
                data: {
                  ...(config.data || {}),
                  currentUserId: userId
                }
              };
            }

            /*
              endpoints that use _userId_ payload prop in POST/PUT requests
            */
            if (
              doesRequestUrlContain({
                route: config?.url ?? '',
                body: true,
                current: false,
                nestedUser: false
              })
            ) {
              return {
                ...config,
                data: {
                  ...(config.data || {}),
                  userId
                }
              };
            }

            /*
              endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
            */
            if (
              doesRequestUrlContain({
                route: config?.url ?? '',
                body: true,
                current: false,
                nestedUser: true
              })
            ) {
              return {
                ...config,
                data: {
                  ...(config.data || {}),
                  user: {
                    ...(config.data.user || {}),
                    userId
                  }
                }
              };
            }

            /*
              endpoints that use _userId_ query param in GET requests
            */
            if (
              doesRequestUrlContain({
                route: config?.url ?? '',
                body: false,
                current: false,
                nestedUser: false
              })
            ) {
              return {
                ...config,
                params: {
                  ...(config.params || {}),
                  userId
                }
              };
            }

            return config;
          }
        );

        const tryUser = () => {
          let createUserAttempts = 0;

          return async function tryUserNTimes(): Promise<any> {
            try {
              return await updateUser({});
            } catch (e) {
              if (createUserAttempts < RETRY_USER_ATTEMPTS) {
                createUserAttempts += 1;
                return tryUserNTimes();
              }

              return Promise.reject(
                new Error(
                  `could not create user after ${createUserAttempts} tries`
                )
              );
            }
          };
        };

        try {
          return await tryUser()();
        } catch (e) {
          /* failed to create a new user. Just silently resolve */
          return Promise.resolve();
        }
      },
      logout: () => {
        typeOfAuth = null;
        authIdentifier = null;
        /* clear fetched in-app messages */
        clearMessages();

        if (typeof authInterceptor === 'number') {
          /* stop adding auth token to requests */
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }

        if (typeof userInterceptor === 'number') {
          /* stop adding JWT to requests */
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }
      }
    };
  }

  /*
    We're using a JWT enabled API key
    callback is assumed to be some sort of GET /api/generate-jwt
  */
  const doRequest = (payload: { email?: string; userID?: string }) => {
    /* clear any token interceptor if any exists */
    if (typeof authInterceptor === 'number') {
      baseAxiosRequest.interceptors.request.eject(authInterceptor);
    }

    if (typeof responseInterceptor === 'number') {
      baseAxiosRequest.interceptors.response.eject(responseInterceptor);
    }

    return generateJWT(payload)
      .then((token) => {
        /* set JWT token and auth token headers */
        authInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => {
            if ((config as any)?.sendBeacon) {
              /*
                send fetch request instead solely so we can use the "keepalive" flag.
                This is used purely for one use-case only - when the user clicks a link
                that is going to navigate the browser tab to a new page/site and we need
                to still call POST /trackInAppClick.

                Normally, since the page is going somewhere new, the browser would navigate away
                and cancel any in-flight requests and not fulfill them, but with the fetch API's
                "keepalive" flag, it will continue the request without blocking the main thread.

                We can't do this with Axios because it's built upon XHR and that doesn't support
                "keepalive" so we fall back to the fetch API
              */
              const cancelConfig = cancelAxiosRequestAndMakeFetch(
                config,
                { email: payload.email, userID: payload.userID },
                token,
                authToken
              );

              return cancelConfig;
            }

            config.headers.set('Api-Key', authToken);
            config.headers.set('Authorization', `Bearer ${token}`);

            return config;
          }
        );

        responseInterceptor = baseAxiosRequest.interceptors.response.use(
          (config) => {
            if (
              doesRequestUrlContain({
                route: config?.config?.url ?? '',
                body: true,
                current: true,
                nestedUser: true
              })
            ) {
              try {
                /*
                  if the customer just called the POST /users/updateEmail
                  that means their JWT needs to be updated to include this new
                  email as well, so we run their JWT generation method and
                  set a new token on the axios interceptor
                */
                const newEmail = JSON.parse(config.config.data)?.newEmail;

                const payloadToPass =
                  typeOfAuth === 'email'
                    ? { email: newEmail }
                    : { userID: authIdentifier ?? '' };

                return generateJWT(payloadToPass).then((newToken) => {
                  /*
                    clear any existing interceptors that are adding user info
                    or API keys
                  */
                  if (typeof authInterceptor === 'number') {
                    /* stop adding auth token to requests */
                    baseAxiosRequest.interceptors.request.eject(
                      authInterceptor
                    );
                  }

                  if (typeof userInterceptor === 'number') {
                    /* stop adding JWT to requests */
                    baseAxiosRequest.interceptors.request.eject(
                      userInterceptor
                    );
                  }

                  /* add the new JWT to all outgoing requests */
                  authInterceptor = baseAxiosRequest.interceptors.request.use(
                    (config) => {
                      if ((config as any)?.sendBeacon) {
                        /*
                          send fetch request instead solely so we can use the "keepalive" flag.
                          This is used purely for one use-case only - when the user clicks a link
                          that is going to navigate the browser tab to a new page/site and we need
                          to still call POST /trackInAppClick.

                          Normally, since the page is going somewhere new, the browser would just
                          navigate away and cancel any in-flight requests and not fulfill them,
                          but with the fetch API's "keepalive" flag, it will continue the request
                          without blocking the main thread.

                          We can't do this with Axios because it's built upon XHR and that
                          doesn't support "keepalive" so we fall back to the fetch API
                        */
                        return cancelAxiosRequestAndMakeFetch(
                          config,
                          { email: newEmail },
                          newToken,
                          authToken
                        );
                      }

                      config.headers.set('Api-Key', authToken);
                      config.headers.set('Authorization', `Bearer ${newToken}`);

                      return config;
                    }
                  );

                  /* add the new email to all outgoing requests  */
                  addEmailToRequest(newEmail);

                  /*
                    set up a new timer for when the JWT expires to regenerate
                    a new one encoded with the new email address.
                  */

                  /*
                    important here to clear the timer first since there was one set up
                    previously the first time the JWT was generated.

                    handleTokenExpiration will clear the timeout for us.
                  */
                  handleTokenExpiration(newToken, () =>
                    /* re-run the JWT generation */
                    doRequest(payloadToPass).catch((e: any) => {
                      console.warn(e);
                      console.warn(
                        'Could not refresh JWT. Try identifying the user again.'
                      );
                    })
                  );

                  return config;
                });
              } catch {
                return config;
              }
            }

            return config;
          },
          (error) => {
            /*
              adds a status code 401 callback to try and get a new JWT
              key if the Iterable API told us the JWT is invalid.
            */
            if (error?.response?.status === 401) {
              return generateJWT(payload)
                .then((newToken) => {
                  if (authInterceptor) {
                    baseAxiosRequest.interceptors.request.eject(
                      authInterceptor
                    );
                  }
                  authInterceptor = baseAxiosRequest.interceptors.request.use(
                    (config) => {
                      if ((config as any)?.sendBeacon) {
                        /*
                          send fetch request instead solely so we can use the "keepalive" flag.
                          This is used purely for one use-case only - when the user clicks a link
                          that is going to navigate the browser tab to a new page/site and we need
                          to still call POST /trackInAppClick.

                          Normally, since the page is going somewhere new, the browser would just
                          navigate away and cancel any in-flight requests and not fulfill
                          them, but with the fetch API's "keepalive" flag, it will continue
                          the request without blocking the main thread.

                          We can't do this with Axios because it's built upon XHR and that
                          doesn't support "keepalive" so we fall back to the fetch API
                        */
                        return cancelAxiosRequestAndMakeFetch(
                          config,
                          { email: payload.email, userID: payload.userID },
                          newToken,
                          authToken
                        );
                      }

                      config.headers.set('Api-Key', authToken);
                      config.headers.set('Authorization', `Bearer ${newToken}`);

                      return config;
                    }
                  );

                  /*
                    finally, after the new JWT is generated, try the original
                    request that failed again.
                  */
                  return axios({
                    ...error.config,
                    headers: {
                      ...error.config.headers,
                      ...STATIC_HEADERS,
                      'Api-Key': authToken,
                      Authorization: `Bearer ${newToken}`
                    }
                  });
                })
                .catch((e: any) =>
                  /*
                    if the JWT generation failed,
                    just abort with a Promise rejection.
                  */
                  Promise.reject(e)
                );
            }

            return Promise.reject(error);
          }
        );
        handleTokenExpiration(token, () =>
          /* re-run the JWT generation */
          doRequest(payload).catch((e: any) => {
            if (logLevel === 'verbose') {
              console.warn(e);
              console.warn(
                'Could not refresh JWT. Try identifying the user again.'
              );
            }
          })
        );
        return token;
      })
      .catch((error: any) => {
        /* clear interceptor */
        if (typeof authInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }
        return Promise.reject(error);
      });
  };
  return {
    clearRefresh: () => {
      /* this will just clear the existing timeout */
      handleTokenExpiration('');
    },
    setEmail: (email: string) => {
      typeOfAuth = 'email';
      authIdentifier = email;
      localStorage.setItem(SHARED_PREF_EMAIL, email);
      /* clear previous user */
      clearMessages();
      if (typeof userInterceptor === 'number') {
        baseAxiosRequest.interceptors.request.eject(userInterceptor);
      }

      addEmailToRequest(email);

      return doRequest({ email }).catch((e: any) => {
        if (logLevel === 'verbose') {
          console.warn(
            'Could not generate JWT after calling setEmail. Please try calling setEmail again.'
          );
        }
        return Promise.reject(e);
      });
    },
    setUserID: async (userId: string) => {
      typeOfAuth = 'userID';
      authIdentifier = userId;
      localStorage.setItem(SHARED_PREF_USER_ID, userId);
      clearMessages();

      if (typeof userInterceptor === 'number') {
        baseAxiosRequest.interceptors.request.eject(userInterceptor);
      }

      /*
        endpoints that use _currentUserId_ payload prop in POST/PUT requests nested in user object
      */
      userInterceptor = baseAxiosRequest.interceptors.request.use((config) => {
        if (
          doesRequestUrlContain({
            route: config?.url ?? '',
            body: true,
            current: true,
            nestedUser: true
          })
        ) {
          return {
            ...config,
            data: {
              ...(config.data || {}),
              currentUserId: userId
            }
          };
        }

        /*
          endpoints that use _serId_ payload prop in POST/PUT requests
        */
        if (
          doesRequestUrlContain({
            route: config?.url ?? '',
            body: true,
            current: false,
            nestedUser: false
          })
        ) {
          return {
            ...config,
            data: {
              ...(config.data || {}),
              userId
            }
          };
        }

        /*
          endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
        */
        if (
          doesRequestUrlContain({
            route: config?.url ?? '',
            body: true,
            current: false,
            nestedUser: true
          })
        ) {
          return {
            ...config,
            data: {
              ...(config.data || {}),
              user: {
                ...(config.data.user || {}),
                userId
              }
            }
          };
        }

        /*
          endpoints that use _userId_ query param in GET requests
        */
        if (
          doesRequestUrlContain({
            route: config?.url ?? '',
            body: false,
            current: false,
            nestedUser: false
          })
        ) {
          return {
            ...config,
            params: {
              ...(config.params || {}),
              userId
            }
          };
        }

        return config;
      });

      const tryUser = () => {
        let createUserAttempts = 0;

        return async function tryUserNTimes(): Promise<any> {
          try {
            return await updateUser({});
          } catch (e) {
            if (createUserAttempts < RETRY_USER_ATTEMPTS) {
              createUserAttempts += 1;
              return tryUserNTimes();
            }

            return Promise.reject(
              new Error(
                `could not create user after ${createUserAttempts} tries`
              )
            );
          }
        };
      };

      return doRequest({ userID: userId })
        .then(async (token) => {
          await tryUser()();
          return token;
        })
        .catch((e: any) => {
          if (logLevel === 'verbose') {
            console.warn(
              'Could not generate JWT after calling setUserID. Please try calling setUserID again.'
            );
          }
          return Promise.reject(e);
        });
    },
    logout: () => {
      typeOfAuth = null;
      authIdentifier = null;
      /* clear fetched in-app messages */
      clearMessages();

      /* this will just clear the existing timeout */
      handleTokenExpiration('');

      if (typeof authInterceptor === 'number') {
        /* stop adding auth token to requests */
        baseAxiosRequest.interceptors.request.eject(authInterceptor);
      }

      if (typeof userInterceptor === 'number') {
        /* stop adding JWT to requests */
        baseAxiosRequest.interceptors.request.eject(userInterceptor);
      }
    },
    refreshJwtToken: async (user: string) => {
      /* this will just clear the existing timeout */
      handleTokenExpiration('');
      const payloadToPass = { [isEmail(user) ? 'email' : 'userID']: user };
      return doRequest(payloadToPass).catch((e: any) => {
        if (logLevel === 'verbose') {
          console.warn(e);
          console.warn('Could not refresh JWT. Try Refresh the JWT again.');
        }
      });
    }
  };
}

export interface WithJWTParams {
  authToken: string;
  configOptions: Partial<Options>;
  generateJWT: (payload: GenerateJWTPayload) => Promise<string>;
}

export interface WithoutJWTParams {
  authToken: string;
  configOptions: Partial<Options>;
}

export interface InitializeParams {
  authToken: string;
  configOptions: Partial<Options>;
  generateJWT?: (payload: GenerateJWTPayload) => Promise<string>;
}

export function initializeWithConfig(initializeParams: WithJWTParams): WithJWT;

export function initializeWithConfig(
  initializeParams: WithoutJWTParams
): WithoutJWT;

export function initializeWithConfig(initializeParams: InitializeParams) {
  const { authToken, configOptions, generateJWT } = initializeParams;
  config.setConfig(configOptions ?? {});
  return generateJWT
    ? initialize(authToken, generateJWT)
    : initialize(authToken);
}
