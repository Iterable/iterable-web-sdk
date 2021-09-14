import axios from 'axios';
import { baseAxiosRequest } from '../request';
import { updateUser } from 'src/users';
import { clearMessages } from 'src/inapp';
import { INVALID_JWT_CODE, RETRY_USER_ATTEMPTS } from 'src/constants';
import { getEpochDifferenceInMS, getEpochExpiryTimeInMS } from './utils';

const ONE_MINUTE = 60000;

interface WithJWT {
  clearRefresh: () => void;
  setEmail: (email: string) => Promise<string>;
  setUserID: (userId: string) => Promise<string>;
  logout: () => void;
}

interface WithoutJWT {
  setNewAuthToken: (newToken?: string) => void;
  clearAuthToken: () => void;
  setEmail: (email: string) => void;
  setUserID: (userId: string) => Promise<void>;
  logout: () => void;
}

export function initIdentify(
  authToken: string,
  generateJWT: (...args: any) => Promise<string>
): WithJWT;
export function initIdentify(authToken: string): WithoutJWT;
export function initIdentify(
  authToken: string,
  generateJWT?: (...args: any) => Promise<string>
) {
  const isDevelopmentMode =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  if (!generateJWT && !isDevelopmentMode) {
    /* only let people use non-JWT mode if running the app locally */
    return console.error(
      'Please provide a Promise method for generating a JWT token.'
    );
  }

  let timer: NodeJS.Timeout | null = null;
  /* 
    only set token interceptor if we're using a non-JWT key.
    Otherwise, we'll set it later once we generate the JWT
  */
  let authInterceptor: number | null = generateJWT
    ? null
    : baseAxiosRequest.interceptors.request.use((config) => ({
        ...config,
        headers: {
          ...config.headers,
          Api_Key: authToken
        }
      }));
  let userInterceptor: number | null = null;

  if (!generateJWT) {
    /* we want to set a normal non-JWT enabled API key */
    return {
      setNewAuthToken: (newToken: string) => {
        if (typeof authInterceptor === 'number') {
          /* clear previously cached interceptor function */
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }
        authInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => ({
            ...config,
            headers: {
              ...config.headers,
              Api_Key: newToken
            }
          })
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
        clearMessages();
        if (typeof userInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }

        /* 
          endpoints that use _currentEmail_ payload prop in POST/PUT requests 
        */
        userInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => {
            if (!!(config?.url || '').match(/updateEmail/gim)) {
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
              !!(config?.url || '').match(
                /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim
              )
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
              !!(config?.url || '').match(
                /(commerce\/updateCart)|(commerce\/trackPurchase)/gim
              )
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
            if (!!(config?.url || '').match(/getMessages/gim)) {
              return {
                ...config,
                params: {
                  ...(config.params || {}),
                  email
                }
              };
            }

            return config;
          }
        );
      },
      setUserID: async (userId: string) => {
        clearMessages();

        if (typeof userInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }

        /*
          endpoints that use _userId_ payload prop in POST/PUT requests 
        */
        userInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => {
            if (!!(config?.url || '').match(/updateEmail/gim)) {
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
              !!(config?.url || '').match(
                /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim
              )
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
              !!(config?.url || '').match(
                /(commerce\/updateCart)|(commerce\/trackPurchase)/gim
              )
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
            if (!!(config?.url || '').match(/getMessages/gim)) {
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
                `could not create user after ${createUserAttempts} tries`
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
  const doRequest = (...args: any) => {
    /* clear any token interceptor if any exists */
    if (authInterceptor) {
      baseAxiosRequest.interceptors.request.eject(authInterceptor);
    }
    return generateJWT(...args)
      .then((token) => {
        /* set JWT token and auth token headers */
        authInterceptor = baseAxiosRequest.interceptors.request.use(
          (config) => ({
            ...config,
            headers: {
              ...config.headers,
              Api_Key: authToken,
              Authorization: `Bearer ${token}`
            }
          })
        );

        baseAxiosRequest.interceptors.response.use(
          (config) => config,
          (error) => {
            /*
              adds a status code 400+ callback to try and get a new JWT
              key if the Iterable API told us the JWT is invalid.
            */
            // console.log(error.response.data.code);
            if (error?.response?.data?.code === INVALID_JWT_CODE) {
              return generateJWT(...args)
                .then((newToken) => {
                  if (authInterceptor) {
                    baseAxiosRequest.interceptors.request.eject(
                      authInterceptor
                    );
                  }
                  authInterceptor = baseAxiosRequest.interceptors.request.use(
                    (config) => ({
                      ...config,
                      headers: {
                        ...config.headers,
                        Api_Key: authToken,
                        Authorization: `Bearer ${newToken}`
                      }
                    })
                  );

                  /*
                    finally, after the new JWT is generated, try the original
                    request that failed again.
                  */
                  return axios({
                    ...error.config,
                    headers: {
                      ...error.config.headers,
                      Api_Key: authToken,
                      Authorization: `Bearer ${newToken}`
                    }
                  });
                })
                .catch((e) => {
                  /*
                    if the JWT generation failed, 
                    just abort with a Promise rejection.
                  */
                  return Promise.reject(e);
                });
            }

            return Promise.reject(error);
          }
        );
        const expTime = getEpochExpiryTimeInMS(token);
        const millisecondsToExpired = getEpochDifferenceInMS(
          Date.now(),
          expTime
        );
        timer = setTimeout(() => {
          if (timer) {
            clearTimeout(timer);
          }
          /* get new token */
          return doRequest(...args).catch((e) => {
            console.warn(e);
            console.warn(
              'Could not refresh JWT. Try identifying the user again.'
            );
          });
          /* try to refresh one minute until expiry */
        }, millisecondsToExpired - ONE_MINUTE);
        return token;
      })
      .catch((error) => {
        /* clear timer */
        if (timer) {
          clearTimeout(timer);
        }
        /* clear interceptor */
        if (typeof authInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }
        return Promise.reject(error);
      });
  };
  return {
    clearRefresh: () => {
      if (timer) {
        clearTimeout(timer);
      }
    },
    setEmail: (email: string) => {
      /* clear previous user */
      clearMessages();
      if (typeof userInterceptor === 'number') {
        baseAxiosRequest.interceptors.request.eject(userInterceptor);
      }

      /* 
        endpoints that use _currentEmail_ payload prop in POST/PUT requests 
      */
      userInterceptor = baseAxiosRequest.interceptors.request.use((config) => {
        if (!!(config?.url || '').match(/updateEmail/gim)) {
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
          !!(config?.url || '').match(
            /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim
          )
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
          !!(config?.url || '').match(
            /(commerce\/updateCart)|(commerce\/trackPurchase)/gim
          )
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
        if (!!(config?.url || '').match(/getMessages/gim)) {
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

      return doRequest(email).catch((e) => {
        console.warn(
          'Could not generate JWT. Please try calling setEmail again.'
        );
        return Promise.reject(e);
      });
    },
    setUserID: async (userId: string) => {
      clearMessages();

      if (typeof userInterceptor === 'number') {
        baseAxiosRequest.interceptors.request.eject(userInterceptor);
      }

      /*
        endpoints that use _userId_ payload prop in POST/PUT requests 
      */
      userInterceptor = baseAxiosRequest.interceptors.request.use((config) => {
        if (!!(config?.url || '').match(/updateEmail/gim)) {
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
          !!(config?.url || '').match(
            /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim
          )
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
          !!(config?.url || '').match(
            /(commerce\/updateCart)|(commerce\/trackPurchase)/gim
          )
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
        if (!!(config?.url || '').match(/getMessages/gim)) {
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
              `could not create user after ${createUserAttempts} tries`
            );
          }
        };
      };

      return doRequest(userId)
        .then(async (token) => {
          await tryUser()();
          return token;
        })
        .catch((e) => {
          console.warn(
            'Could not generate JWT. Please try calling setUserID again.'
          );
          return Promise.reject(e);
        });
    },
    logout: () => {
      /* clear fetched in-app messages */
      clearMessages();

      if (timer) {
        /* prevent any refreshing of JWT */
        clearTimeout(timer);
      }

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
