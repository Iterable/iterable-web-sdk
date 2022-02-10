(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../request", "./commerce.schema"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../request"), require("./commerce.schema"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.request, global.commerce);
    global.commerce = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _request, _commerce) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateCart = _exports.trackPurchase = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const updateCart = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    if (payload.user) {
      delete payload.user.userId;
      delete payload.user.email;
    }

    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/commerce/updateCart',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        user: _objectSpread(_objectSpread({}, payload.user), {}, {
          preferUserId: true
        })
      }),
      validation: {
        data: _commerce.updateCartSchema
      }
    });
  };

  _exports.updateCart = updateCart;

  const trackPurchase = payload => {
    /* a customer could potentially send these up if they're not using TypeScript */
    if (payload.user) {
      delete payload.user.userId;
      delete payload.user.email;
    }

    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/commerce/trackPurchase',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        user: _objectSpread(_objectSpread({}, payload.user), {}, {
          preferUserId: true
        })
      }),
      validation: {
        data: _commerce.trackPurchaseSchema
      }
    });
  };

  _exports.trackPurchase = trackPurchase;
});