/* number of MS to wait between in-app messages to show the next one */
export const DISPLAY_INTERVAL_DEFAULT = 30000;

/* how many times we try to create a new user when _setUserID_ is invoked */
export const RETRY_USER_ATTEMPTS = 0;

const IS_EU_ITERABLE_SERVICE =
  process.env.IS_EU_ITERABLE_SERVICE === 'true' ? true : false;

export const dangerouslyAllowJsPopupExecution =
  process.env.DANGEROUSLY_ALLOW_JS_POPUP_EXECUTION === 'true' ? true : false;

const US_ITERABLE_DOMAIN = 'api.iterable.com';

const EU_ITERABLE_DOMAIN = 'api.eu.iterable.com';

const ITERABLE_API_URL = `https://${
  IS_EU_ITERABLE_SERVICE ? EU_ITERABLE_DOMAIN : US_ITERABLE_DOMAIN
}/api`;

export const EU_ITERABLE_API = `https://${EU_ITERABLE_DOMAIN}/api`;

// Do not set `process.env.BASE_URL` if intending on using the prod or EU APIs.
export const BASE_URL = process.env.BASE_URL || ITERABLE_API_URL;

export const GETMESSAGES_PATH = '/inApp/web/getMessages';
export const GET_CRITERIA_PATH = '/anonymoususer/list';
export const ENDPOINT_GET_USER_BY_USERID = 'users/byUserId';
export const ENDPOINT_GET_USER_BY_EMAIL = 'users/getByEmail';
export const ENDPOINT_MERGE_USER = 'users/merge';
export const ENDPOINT_TRACK_ANON_SESSION = 'anonymoususer/events/session';

/** @todo update once new endpoint is ready */
export const CACHE_ENABLED_GETMESSAGES_PATH = '/newEndpoint';

const GET_ENABLE_INAPP_CONSUME = () => {
  try {
    return JSON.parse(process.env.ENABLE_INAPP_CONSUME);
  } catch {
    return true;
  }
};

export const ENABLE_INAPP_CONSUME = GET_ENABLE_INAPP_CONSUME();

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const SDK_VERSION = process.env.VERSION;

/* 
  API payload _platform_ param which is send up automatically 
  with tracking and getMessage requests 
*/
export const WEB_PLATFORM = 'Web';

/** @todo uncomment when these headers don't give CORS errors */
export const STATIC_HEADERS = {
  // 'SDK-Version': SDK_VERSION,
  // 'SDK-Platform': WEB_PLATFORM
};

/* how long animations fade/side in for. */
export const ANIMATION_DURATION = 400;

export const DEFAULT_CLOSE_BUTTON_OFFSET_PERCENTAGE = 4;
export const CLOSE_X_BUTTON_ID = 'close-x-button';
export const ABSOLUTE_DISMISS_BUTTON_ID = 'absolute-dismiss-button';

export const ANIMATION_STYLESHEET = (
  animationDuration: number = ANIMATION_DURATION
) => `
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-moz-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-webkit-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-ms-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slidein {
    100% { transform: translateX(0%) }
  }

  @-moz-keyframes slidein {
    100% { -moz-transform: translateX(0%) }
  }

  @-webkit-keyframes slidein {
    100% { -webkit-transform: translateX(0%) }
  }

  @-ms-keyframes slidein {
    100% { -ms-transform: translateX(0%) }
  }

  @keyframes slideout {
    0% { transform: translateX(0%) }
    100% { transform: translateX(150%) }
  }

  @-moz-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -moz-transform: translateX(150%) }
  }

  @-webkit-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -webkit-transform: translateX(150%) }
  }

  @-ms-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -ms-transform: translateX(150%) }
  }

  .slide-in {
    -webkit-animation: slidein ${animationDuration}ms forwards;
    -moz-animation: slidein ${animationDuration}ms forwards;
    -ms-animation: slidein ${animationDuration}ms forwards;
    -o-animation: slidein ${animationDuration}ms forwards;
    animation: slidein ${animationDuration}ms forwards;
  }

  .slide-out {
    -webkit-animation: slideout ${animationDuration}ms forwards;
    -moz-animation: slideout ${animationDuration}ms forwards;
    -ms-animation: slideout ${animationDuration}ms forwards;
    -o-animation: slideout ${animationDuration}ms forwards;
    animation: slideout ${animationDuration}ms forwards;
  }

  .fade-in {
    -webkit-animation: fadein ${animationDuration}ms;
    -moz-animation: fadein ${animationDuration}ms;
    -ms-animation: fadein ${animationDuration}ms;
    -o-animation: fadein ${animationDuration}ms;
    animation: fadein ${animationDuration}ms;
  }

  .fade-out {
    visibility: hidden;
    opacity: 0;
    -webkit-transition: visibility 0s ${animationDuration}ms, opacity ${animationDuration}ms linear;
    -moz-transition: visibility 0s ${animationDuration}ms, opacity ${animationDuration}ms linear;
    -ms-transition: visibility 0s ${animationDuration}ms, opacity ${animationDuration}ms linear;
    -o-transition: visibility 0s ${animationDuration}ms, opacity ${animationDuration}ms linear;
    transition: visibility 0s ${animationDuration}ms, opacity ${animationDuration}ms linear;
  }
`;

export const SHARED_PREFS_EVENT_TYPE = 'eventType';
export const SHARED_PREFS_EVENT_LIST_KEY = 'itbl_event_list';
export const SHARED_PREFS_CRITERIA = 'criteria';
export const SHARED_PREFS_ANON_SESSIONS = 'itbl_anon_sessions';
export const SHARED_PREF_USER_ID = 'userId';
export const SHARED_PREF_EMAIL = 'email';

export const KEY_EVENT_NAME = 'eventName';
export const KEY_CREATED_AT = 'createdAt';
export const KEY_DATA_FIELDS = 'dataFields';
export const KEY_CREATE_NEW_FIELDS = 'createNewFields';
export const KEY_ITEMS = 'items';
export const KEY_TOTAL = 'total';
export const DATA_REPLACE = 'dataReplace';

export const TRACK_EVENT = 'customEvent';
export const TRACK_PURCHASE = 'purchase';
export const UPDATE_USER = 'updateUser';
export const TRACK_UPDATE_CART = 'cartUpdate';
