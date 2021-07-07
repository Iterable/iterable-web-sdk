import { baseRequest } from '../request';

interface WithJWT {
  clearRefresh: () => void;
  setEmail: (newEmail: string) => Promise<string>;
  setUserId: (newId: string) => Promise<string>;
}

interface WithoutJWT {
  setNewToken: (newToken?: string) => void;
  clearToken: () => void;
  setEmail: (email: string) => void;
  setUserID: (userId: string) => void;
  clearUser: () => void;
}

export function initIdentify(
  authToken: string,
  jwtEnabled: true,
  callback: (...args: any) => Promise<string>
): WithJWT;
export function initIdentify(authToken: string, jwtEnabled: false): WithoutJWT;
export function initIdentify(authToken: string): WithoutJWT;
export function initIdentify(
  authToken: string,
  jwtEnabled?: boolean,
  callback?: (...args: any) => Promise<string>
) {
  let timer: NodeJS.Timeout | null = null;
  let expMin: number | null = null;
  let authInterceptor: number | null = baseRequest.interceptors.request.use(
    (config) => ({
      ...config,
      headers: {
        ...config.headers,
        Api_Key: authToken
      }
    })
  );
  let userInterceptor: number | null = null;

  if (!jwtEnabled || !callback) {
    /* we want to set a normal non-JWT enabled API key */
    return {
      setNewToken: (newToken?: string) => {
        if (typeof authInterceptor === 'number') {
          /* clear previously cached interceptor function */
          baseRequest.interceptors.request.eject(authInterceptor);
        }
        authInterceptor = baseRequest.interceptors.request.use((config) => ({
          ...config,
          headers: {
            ...config.headers,
            Api_Key: newToken || authToken
          }
        }));
      },
      clearToken: () => {
        /* might be 0 which is a falsy value */
        if (typeof authInterceptor === 'number') {
          /* clear previously cached interceptor function */
          baseRequest.interceptors.request.eject(authInterceptor);
        }
      },
      setEmail: (email: string) => {
        if (typeof userInterceptor === 'number') {
          baseRequest.interceptors.request.eject(userInterceptor);
        }

        userInterceptor = baseRequest.interceptors.request.use((config) => {
          /* 
            in other words, if the email is part of the actual API endpoint path 
            find and replace "{email}" with the actual user email

            Otherwise the email is a query param

            Compare the payloads from these two endpoints to get an idea of what
            purpose this serves:

            1. email as query param (https://api.iterable.com/api/docs#In-app_getMessages)
            2. email as url path (https://api.iterable.com/api/docs#users_getUser)
          */
          return !!(config?.url || '').match(/{email}/gim)
            ? {
                ...config,
                url: config.url?.replace(
                  /{email}/gim,
                  encodeURIComponent(email)
                )
              }
            : !!config.params?.email
            ? /* 
              if the user passed an email as a param already (which is possible if the user
              explicitly passes an email as an argument to whatever API method they're
              calling), just use that and don't overwrite it here.
            */
              config
            : {
                ...config,
                params: {
                  ...config.params,
                  email
                }
              };
        });
      },
      setUserID: (userId: string) => {
        if (typeof userInterceptor === 'number') {
          baseRequest.interceptors.request.eject(userInterceptor);
        }

        userInterceptor = baseRequest.interceptors.request.use((config) => {
          return config.params?.userId
            ? /* 
              if the user passed a user ID as a param already (which is possible if the user
              explicitly passes a user ID as an argument to whatever API method they're
              calling), just use that and don't overwrite it here.
            */
              config
            : {
                ...config,
                params: {
                  ...config.params,
                  userId
                }
              };
        });
      },
      clearUser: () => {
        if (typeof userInterceptor === 'number') {
          baseRequest.interceptors.request.eject(userInterceptor);
        }
      }
    };
  }

  /* 
    We're using a JWT enabled API key
    callback is assumed to be some sort of GET /api/generate-jwt 
  */
  const doRequest = (...args: any) => {
    /* clear timer */
    clearInterval(timer as any);
    /* clear interceptor */
    if (authInterceptor) {
      baseRequest.interceptors.request.eject(authInterceptor);
    }
    return callback(...args)
      .then((token) => {
        /* set interceptor */
        authInterceptor = baseRequest.interceptors.request.use((config) => ({
          ...config,
          headers: {
            ...config.headers,
            Api_Key: authToken,
            Authorization: `Bearer ${token}`
          }
        }));
        expMin = new Date().getMinutes() + 2;
        timer = setInterval(() => {
          /* check to see if token has expired */
          if (expMin && expMin - new Date().getMinutes() <= 1) {
            /* token has expired. get new JWT */
            return doRequest(...args);
          }
        }, 10000);
        return token;
      })
      .catch((error) => {
        /* clear timer */
        if (timer) {
          clearInterval(timer);
        }
        /* clear interceptor */
        if (typeof authInterceptor === 'number') {
          baseRequest.interceptors.request.eject(authInterceptor);
        }
        return Promise.reject(error);
      });
  };
  return {
    clearRefresh: () => clearInterval(timer as any),
    setEmail: (newEmail: string) => doRequest(newEmail),
    setUserId: (newId: string) => doRequest(newId)
  };
}
