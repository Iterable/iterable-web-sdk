/* number of MS to wait between in-app messages to show the next one */
export const DISPLAY_INTERVAL_DEFAULT = 30000;

/* how many times we try to create a new user when _setUserID_ is invoked */
export const RETRY_USER_ATTEMPTS = 0;

export const BASE_URL = process.env.BASE_URL || 'https://api.iterable.com/api';

/* 
  API payload _platform_ param which is send up automatically 
  with tracking and getMessage requests 
*/
export const WEB_PLATFORM = 'Web';

/* how long animations fade/side in for. */
export const ANIMATION_DURATION = 400;
