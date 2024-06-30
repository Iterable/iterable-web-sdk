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
export const ENDPOINT_MERGE_USER = '/users/merge';
export const ENDPOINT_TRACK_ANON_SESSION = '/anonymoususer/events/session';

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

export const URL_SCHEME_ITBL = 'itbl://';
export const URL_SCHEME_ACTION = 'action://';
export const URL_SCHEME_OPEN = 'openUrl';
export const SHARED_PREF_USER_ID = 'userId';
export const SHARED_PREF_EMAIL = 'email';

export type RouteConfig = {
  route: string;
  /** true for POST/PUT requests */
  body: boolean;
  /** true if email or userId in request needs to be prepended with `current` */
  current: boolean;
  /** true if route expects email or userId field to be nested in user object */
  nestedUser: boolean;
};

type EndPointStructure = Record<string, RouteConfig>;

export const ENDPOINTS: EndPointStructure = {
  commerce_update_cart: {
    route: '/commerce/updateCart',
    body: true,
    current: false,
    nestedUser: true
  },
  commerce_track_purchase: {
    route: '/commerce/trackPurchase',
    body: true,
    current: false,
    nestedUser: true
  },
  update_email: {
    route: '/users/updateEmail',
    body: true,
    current: true,
    nestedUser: true
  },
  users_update: {
    route: '/users/update',
    body: true,
    current: false,
    nestedUser: false
  },
  users_update_subscriptions: {
    route: '/users/updateSubscriptions',
    body: true,
    current: false,
    nestedUser: false
  },
  get_in_app_messages: {
    route: '/inApp/web/getMessages',
    body: false,
    current: false,
    nestedUser: false
  },
  get_embedded_messages: {
    route: '/embedded-messaging/messages',
    body: false,
    current: false,
    nestedUser: false
  },
  event_track: {
    route: '/events/track',
    body: true,
    current: false,
    nestedUser: false
  },
  msg_received_event_track: {
    route: '/embedded-messaging/events/received',
    body: true,
    current: false,
    nestedUser: false
  },
  msg_click_event_track: {
    route: '/embedded-messaging/events/click',
    body: true,
    current: false,
    nestedUser: false
  },
  track_app_close: {
    route: '/events/trackInAppClose',
    body: true,
    current: false,
    nestedUser: false
  },
  track_app_open: {
    route: '/events/trackInAppOpen',
    body: true,
    current: false,
    nestedUser: false
  },
  track_app_click: {
    route: '/events/trackInAppClick',
    body: true,
    current: false,
    nestedUser: false
  },
  track_app_delivery: {
    route: '/events/trackInAppDelivery',
    body: true,
    current: false,
    nestedUser: false
  },
  track_app_consume: {
    route: '/events/inAppConsume',
    body: true,
    current: false,
    nestedUser: false
  },
  msg_dismiss: {
    route: '/embedded-messaging/events/dismiss',
    body: true,
    current: false,
    nestedUser: false
  },
  msg_session_event_track: {
    route: '/embedded-messaging/events/session',
    body: true,
    current: false,
    nestedUser: false
  }
};

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
export const SHARED_PREF_ANON_USER_ID = 'anon_userId';
export const SHARED_PREF_MATCHED_CRITERIAS = 'matchedCriterias';

export const KEY_EVENT_NAME = 'eventName';
export const KEY_CREATED_AT = 'createdAt';
export const KEY_DATA_FIELDS = 'dataFields';
export const KEY_CREATE_NEW_FIELDS = 'createNewFields';
export const KEY_ITEMS = 'items';
export const KEY_TOTAL = 'total';
export const KEY_PREFER_USERID = 'preferUserId';
export const DATA_REPLACE = 'dataReplace';

export const TRACK_EVENT = 'customEvent';
export const TRACK_PURCHASE = 'purchase';
export const UPDATE_USER = 'user';
export const TRACK_UPDATE_CART = 'cartUpdate';
export const UPDATE_CART = 'updateCart';

export const INITIALIZE_ERROR =
  'Iterable SDK must be initialized with an API key and user email/userId before calling SDK methods';
