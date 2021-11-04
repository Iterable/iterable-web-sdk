(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../request", "../constants", "./events.schema"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../request"), require("../constants"), require("./events.schema"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.request, global.constants, global.events);
    global.events = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _request, _constants, _events) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.trackInAppConsume = _exports.trackInAppDelivery = _exports.trackInAppClick = _exports.trackInAppOpen = _exports.trackInAppClose = _exports.track = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const track = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/track',
      data: payload,
      validation: {
        data: _events.trackSchema
      }
    });
  };

  _exports.track = track;

  const trackInAppClose = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/trackInAppClose',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        deviceInfo: _objectSpread(_objectSpread({}, payload.deviceInfo), {}, {
          platform: _constants.WEB_PLATFORM,
          deviceId: global.navigator.userAgent || ''
        })
      }),
      validation: {
        data: _events.eventRequestSchema
      }
    });
  };

  _exports.trackInAppClose = trackInAppClose;

  const trackInAppOpen = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/trackInAppOpen',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        deviceInfo: _objectSpread(_objectSpread({}, payload.deviceInfo), {}, {
          platform: _constants.WEB_PLATFORM,
          deviceId: global.navigator.userAgent || ''
        })
      }),
      validation: {
        data: _events.eventRequestSchema.omit(['clickedUrl', 'inboxSessionId', 'closeAction'])
      }
    });
  };

  _exports.trackInAppOpen = trackInAppOpen;

  const trackInAppClick = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/trackInAppClick',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        deviceInfo: _objectSpread(_objectSpread({}, payload.deviceInfo), {}, {
          platform: _constants.WEB_PLATFORM,
          deviceId: global.navigator.userAgent || ''
        })
      }),
      validation: {
        data: _events.eventRequestSchema.omit(['inboxSessionId', 'closeAction'])
      }
    });
  };

  _exports.trackInAppClick = trackInAppClick;

  const trackInAppDelivery = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/trackInAppDelivery',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        deviceInfo: _objectSpread(_objectSpread({}, payload.deviceInfo), {}, {
          platform: _constants.WEB_PLATFORM,
          deviceId: global.navigator.userAgent || ''
        })
      }),
      validation: {
        data: _events.eventRequestSchema.omit(['clickedUrl', 'inboxSessionId', 'closeAction'])
      }
    });
  };

  _exports.trackInAppDelivery = trackInAppDelivery;

  const trackInAppConsume = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/events/inAppConsume',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        deviceInfo: _objectSpread(_objectSpread({}, payload.deviceInfo), {}, {
          platform: _constants.WEB_PLATFORM,
          deviceId: global.navigator.userAgent || ''
        })
      }),
      validation: {
        data: _events.eventRequestSchema.omit(['clickedUrl', 'inboxSessionId', 'closeAction'])
      }
    });
  };

  _exports.trackInAppConsume = trackInAppConsume;
});