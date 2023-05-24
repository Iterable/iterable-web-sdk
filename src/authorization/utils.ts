import { Buffer } from 'buffer';
import axios, { AxiosRequestConfig } from 'axios';

export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_YEAR = 365 * ONE_DAY;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MS_EPOCH_THRESHOLD = ONE_YEAR;

export const getEpochExpiryTimeInMS = (jwt: string) => {
  /** @thanks https://stackoverflow.com/a/38552302/7455960  */
  try {
    const base64Url = jwt.split('.')?.[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map(
          (character) =>
            '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );

    const expTime = JSON.parse(jsonPayload)?.exp;
    return expTime < MS_EPOCH_THRESHOLD ? expTime * ONE_SECOND : expTime;
  } catch {
    return 0;
  }
};

/*
  take two epoch timestamps and diff them and return them in MS.
  Also tries to convert seconds to MS if needed (since some server languages like 
  python deal with time in seconds).
*/
export const getEpochDifferenceInMS = (
  epochNow: number,
  epochFuture: number
) => {
  let parsedNow = epochNow;
  let parsedFuture = epochFuture;
  if (epochNow < MS_EPOCH_THRESHOLD) {
    /* convert to MS if in seconds */
    parsedNow = epochNow * ONE_SECOND;
  }
  if (epochFuture < MS_EPOCH_THRESHOLD) {
    /* convert to MS if in seconds */
    parsedFuture = epochFuture * ONE_SECOND;
  }
  return parsedFuture - parsedNow;
};

export const cancelAxiosRequestAndMakeFetch = (
  config: AxiosRequestConfig,
  { email, userID }: { email?: string; userID?: string },
  jwtToken: string,
  authToken: string
) => {
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
  const additionalData = email ? { email: email } : { userId: userID };
  fetch(`${config.baseURL}${config.url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': authToken,
      Authorization: `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ ...config?.data, ...additionalData } || {}),
    keepalive: true
  }).catch();

  /* cancel the axios request */
  return {
    ...config,
    cancelToken: new axios.CancelToken((cancel) => {
      cancel('Cancel repeated request');
    })
  };
};

export const validateTokenTime = (expTime: number): boolean => {
  const isValid = expTime < ONE_MINUTE;
  return isValid;
};
export const isEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
