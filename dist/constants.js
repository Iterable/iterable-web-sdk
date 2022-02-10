(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.constants = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WEB_PLATFORM = _exports.STATIC_HEADERS = _exports.SDK_VERSION = _exports.RETRY_USER_ATTEMPTS = _exports.IS_PRODUCTION = _exports.ENABLE_INAPP_CONSUME = _exports.DISPLAY_INTERVAL_DEFAULT = _exports.BASE_URL = _exports.ANIMATION_STYLESHEET = _exports.ANIMATION_DURATION = void 0;

  /* number of MS to wait between in-app messages to show the next one */
  const DISPLAY_INTERVAL_DEFAULT = 30000;
  /* how many times we try to create a new user when _setUserID_ is invoked */

  _exports.DISPLAY_INTERVAL_DEFAULT = DISPLAY_INTERVAL_DEFAULT;
  const RETRY_USER_ATTEMPTS = 0;
  _exports.RETRY_USER_ATTEMPTS = RETRY_USER_ATTEMPTS;
  const BASE_URL = process.env.BASE_URL || 'https://api.iterable.com/api';
  _exports.BASE_URL = BASE_URL;

  const GET_ENABLE_INAPP_CONSUME = () => {
    try {
      return JSON.parse(process.env.ENABLE_INAPP_CONSUME);
    } catch {
      return true;
    }
  };

  const ENABLE_INAPP_CONSUME = GET_ENABLE_INAPP_CONSUME();
  _exports.ENABLE_INAPP_CONSUME = ENABLE_INAPP_CONSUME;
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';
  _exports.IS_PRODUCTION = IS_PRODUCTION;
  const SDK_VERSION = process.env.VERSION;
  /* 
    API payload _platform_ param which is send up automatically 
    with tracking and getMessage requests 
  */

  _exports.SDK_VERSION = SDK_VERSION;
  const WEB_PLATFORM = 'Web';
  /** @todo uncomment when these headers don't give CORS errors */

  _exports.WEB_PLATFORM = WEB_PLATFORM;
  const STATIC_HEADERS = {// 'SDK-Version': SDK_VERSION,
    // 'SDK-Platform': WEB_PLATFORM
  };
  /* how long animations fade/side in for. */

  _exports.STATIC_HEADERS = STATIC_HEADERS;
  const ANIMATION_DURATION = 400;
  _exports.ANIMATION_DURATION = ANIMATION_DURATION;

  const ANIMATION_STYLESHEET = (animationDuration = ANIMATION_DURATION) => `
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

  _exports.ANIMATION_STYLESHEET = ANIMATION_STYLESHEET;
});