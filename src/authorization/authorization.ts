import { baseRequest } from '../request';

interface WithJWT {
  clearRefresh: () => void;
  setEmail: (newEmail: string) => Promise<string>;
  setUserId: (newId: string) => Promise<string>;
}

interface WithoutJWT {
  setToken: () => void;
  clearToken: () => void;
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
  let interceptor: number | null = null;

  if (!jwtEnabled || !callback) {
    /* we want to set a normal non-JWT enabled API key */
    return {
      setToken: () => {
        if (interceptor) {
          /* clear previously cached interceptor function */
          baseRequest.interceptors.request.eject(interceptor);
        }
        interceptor = baseRequest.interceptors.request.use((config) => ({
          ...config,
          headers: {
            ...config.headers,
            Api_Key: authToken
          }
        }));
      },
      clearToken: () => {
        /* might be 0 which is a falsy value */
        if (typeof interceptor === 'number') {
          /* clear previously cached interceptor function */
          baseRequest.interceptors.request.eject(interceptor);
        }
      }
    } as WithoutJWT;
  }

  /* 
    We're using a JWT enabled API key
    callback is assumed to be some sort of GET /api/generate-jwt 
  */
  const doRequest = (...args: any) => {
    /* clear timer */
    clearInterval(timer as any);
    /* clear interceptor */
    if (interceptor) {
      baseRequest.interceptors.request.eject(interceptor);
    }
    return callback(...args)
      .then((token) => {
        /* set interceptor */
        interceptor = baseRequest.interceptors.request.use((config) => ({
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
        if (typeof interceptor === 'number') {
          baseRequest.interceptors.request.eject(interceptor);
        }
        return Promise.reject(error);
      });
  };
  return {
    clearRefresh: () => clearInterval(timer as any),
    setEmail: (newEmail) => doRequest(newEmail),
    setUserId: (newId) => doRequest(newId)
  } as WithJWT;
}

interface Hi {
  (hello: string): Promise<any>;
}

export const hi: Hi = (hello) => {
  return Promise.resolve('fdsa');
};

export const helo = hi('fdsafds').then((response) => {
  console.log(response);
});

// const t = initIdentify('123', true, () => Promise.resolve('fdsafsf'));
// const f = initIdentify('123');
// const h = initIdentify('123', false);
