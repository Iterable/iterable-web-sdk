import { baseAxiosRequest } from '../request';
import { updateUser } from 'src/users';
import { clearMessages } from 'src/inapp';
import { RETRY_USER_ATTEMPTS } from 'src/constants';

// interface WithJWT {
//   clearRefresh: () => void;
//   setEmail: (newEmail: string) => Promise<string>;
//   setUserId: (newId: string) => Promise<string>;
// }

interface WithoutJWT {
  setNewToken: (newToken?: string) => void;
  clearToken: () => void;
  setEmail: (email: string) => void;
  setUserID: (userId: string) => Promise<void>;
  logout: () => void;
}

// export function initIdentify(
//   authToken: string,
//   jwtEnabled: true,
//   callback: (...args: any) => Promise<string>
// ): WithJWT;
export function initIdentify(authToken: string, jwtEnabled: false): WithoutJWT;
export function initIdentify(authToken: string): WithoutJWT;
export function initIdentify(
  authToken: string,
  jwtEnabled?: boolean,
  callback?: (...args: any) => Promise<string>
) {
  // let timer: NodeJS.Timeout | null = null;
  // let expMin: number | null = null;
  let authInterceptor: number | null =
    baseAxiosRequest.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...config.headers,
        Api_Key: authToken
      }
    }));
  let userInterceptor: number | null = null;

  if (!jwtEnabled || !callback) {
    /* we want to set a normal non-JWT enabled API key */
    return {
      setNewToken: (newToken: string) => {
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
      clearToken: () => {
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
                /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)/gim
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
                /(users\/update)|(events\/trackInApp)|(events\/inAppConsume)/gim
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
        clearMessages();
        if (typeof userInterceptor === 'number') {
          baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }
      }
    };
  }

  /* 
    We're using a JWT enabled API key
    callback is assumed to be some sort of GET /api/generate-jwt 
  */
  // const doRequest = (...args: any) => {
  //   /* clear timer */
  //   clearInterval(timer as any);
  //   /* clear interceptor */
  //   if (authInterceptor) {
  //     baseAxiosRequest.interceptors.request.eject(authInterceptor);
  //   }
  //   return callback(...args)
  //     .then((token) => {
  //       /* set interceptor */
  //       authInterceptor = baseAxiosRequest.interceptors.request.use((config) => ({
  //         ...config,
  //         headers: {
  //           ...config.headers,
  //           Api_Key: authToken,
  //           Authorization: `Bearer ${token}`
  //         }
  //       }));
  //       expMin = new Date().getMinutes() + 2;
  //       timer = setInterval(() => {
  //         /* check to see if token has expired */
  //         if (expMin && expMin - new Date().getMinutes() <= 1) {
  //           /* token has expired. get new JWT */
  //           return doRequest(...args);
  //         }
  //       }, 10000);
  //       return token;
  //     })
  //     .catch((error) => {
  //       /* clear timer */
  //       if (timer) {
  //         clearInterval(timer);
  //       }
  //       /* clear interceptor */
  //       if (typeof authInterceptor === 'number') {
  //         baseAxiosRequest.interceptors.request.eject(authInterceptor);
  //       }
  //       return Promise.reject(error);
  //     });
  // };
  // return {
  //   clearRefresh: () => clearInterval(timer as any),
  //   setEmail: (newEmail: string) => doRequest(newEmail),
  //   setUserId: (newId: string) => doRequest(newId)
  // };
}
