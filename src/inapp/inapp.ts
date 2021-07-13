import { InAppMessagesRequestParams, InAppMessageResponse } from './types';
import { baseIterableRequest } from '../request';
// import { showInAppMessagesOnInterval } from './utils';

export const getInAppMessages = (payload: InAppMessagesRequestParams) => {
  return baseIterableRequest<InAppMessageResponse>({
    method: 'GET',
    url: '/inApp/getMessages',
    params: payload
  }).then((response) => {
    /* 
      if the user passed the flag to automatically paint the in-app messages
      to the DOM, start a timer and show each in-app message upon close + timer countdown

      However there are 3 conditions in which to not show a message:

      1. _read_ key is truthy
      2. _trigger.type_ key is "never"
      3. HTML body is blank
    */
    if (payload?.showInAppMessagesAutomatically) {
      // showInAppMessagesOnInterval(returnedHTML, payload.interval);
    }

    return response;
  });
};
