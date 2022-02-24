import { Buffer } from 'buffer';
import axios, { AxiosRequestConfig } from 'axios';

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
    return expTime < 10000000000 ? expTime * 1000 : expTime;
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
  if (epochNow < 10000000000) {
    /* convert to MS if in seconds */
    parsedNow = epochNow * 1000;
  }
  if (epochFuture < 10000000000) {
    /* convert to MS if in seconds */
    parsedFuture = epochFuture * 1000;
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
