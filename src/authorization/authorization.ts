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

interface GenerateJWTPayload {
  email?: string;
  userID?: string;
}

export function initIdentify(
  authToken: string,
  generateJWT: (...args: any) => Promise<string>
): WithJWT;
export function initIdentify(authToken: string): WithoutJWT;
export function initIdentify(
  authToken: string,
  generateJWT?: (payload: GenerateJWTPayload) => Promise<string>
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
          'Api-Key': authToken
        }
      }));
  let userInterceptor: number | null = null;
  let responseInterceptor: number | null = null;

  /**
    method that sets a timer one minute before JWT expiration

    @param { string } jwt - JWT token to decode
    @param { (...args: any ) => Promise<any> } callback - promise to invoke before expiry
  */
  const handleTokenExpiration = (
    jwt: string,
    callback: (...args: any) => Promise<any>
  ) => {
    const expTime = getEpochExpiryTimeInMS(jwt);
    const millisecondsToExpired = getEpochDifferenceInMS(Date.now(), expTime);
    timer = setTimeout(() => {
      if (timer) {
        /* clear existing timeout on JWT refresh */
        clearTimeout(timer);
      }
      /* get new token */
      return callback().catch((e) => {
        console.warn(e);
        console.warn('Could not refresh JWT. Try identifying the user again.');
      });
      /* try to refresh one minute until expiry */
    }, millisecondsToExpired - ONE_MINUTE);
  };

  const addEmailToRequest = (email: string) => {
    userInterceptor = baseAxiosRequest.interceptors.request.use((config) => {
      /* 
        endpoints that use _currentEmail_ payload prop in POST/PUT requests 
      */
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
          (config) => ({
            ...config,
            headers: {
              ...config.headers,
              'Api-Key': newToken
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
        addEmailToRequest(email);
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
          (config) => ({
            ...config,
            headers: {
              ...config.headers,
              'Api-Key': authToken,
              Authorization: `Bearer ${token}`
            }
          })
        );

        responseInterceptor = baseAxiosRequest.interceptors.response.use(
          (config) => {
            if (config.config.url?.match(/users\/updateEmail/gim)) {
              try {
                /* 
                  if the customer just called the POST /users/updateEmail 
                  that means their JWT needs to be updated to include this new
                  email as well, so we run their JWT generation method and
                  set a new token on the axios interceptor
                */
                const newEmail = JSON.parse(config.config.data)?.newEmail;

                return generateJWT({ email: newEmail }).then((newToken) => {
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
                    (config) => ({
                      ...config,
                      headers: {
                        ...config.headers,
                        Api_Key: authToken,
                        Authorization: `Bearer ${newToken}`
                      }
                    })
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
                  */
                  if (timer) {
                    clearTimeout(timer);
                  }

                  handleTokenExpiration(newToken, () => {
                    /* re-run the JWT generation */
                    return doRequest({ email: newEmail }).catch((e) => {
                      console.warn(e);
                      console.warn(
                        'Could not refresh JWT. Try identifying the user again.'
                      );
                    });
                  });

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
              adds a status code 400+ callback to try and get a new JWT
              key if the Iterable API told us the JWT is invalid.
            */
            if (error?.response?.data?.code === INVALID_JWT_CODE) {
              return generateJWT(payload)
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
                        'Api-Key': authToken,
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
                      'Api-Key': authToken,
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
        handleTokenExpiration(token, () => {
          /* re-run the JWT generation */
          return doRequest(payload).catch((e) => {
            console.warn(e);
            console.warn(
              'Could not refresh JWT. Try identifying the user again.'
            );
          });
        });
        return token;
      })
      .catch((error) => {
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

      addEmailToRequest(email);

      return doRequest({ email }).catch((e) => {
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

      return doRequest({ userID: userId })
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
