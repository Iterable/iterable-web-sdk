/* number of MS to wait between in-app messages to show the next one */
export const DISPLAY_INTERVAL_DEFAULT = 30000;

/* how many times we try to create a new user when _setUserID_ is invoked */
export const RETRY_USER_ATTEMPTS = 0;

export const BASE_URL = process.env.BASE_URL || 'https://api.iterable.com/api';

export const GETMESSAGES_PATH = '/inApp/web/getMessages';

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
