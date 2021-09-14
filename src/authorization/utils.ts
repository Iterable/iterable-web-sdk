import { Buffer } from 'buffer';

export const getEpochExpiryTimeInMS = (jwt: string) => {
  /** @thanks https://stackoverflow.com/a/38552302/7455960  */
  const base64Url = jwt.split('.')[1];
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

  try {
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
