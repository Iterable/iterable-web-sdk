(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "axios", "./constants", "./utils/config"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("axios"), require("./constants"), require("./utils/config"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.axios, global.constants, global.config);
    global.request = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _axios, _constants, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.baseIterableRequest = _exports.baseAxiosRequest = void 0;
  _axios = _interopRequireDefault(_axios);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const baseAxiosRequest = _axios.default.create({
    baseURL: _constants.BASE_URL
  });

  _exports.baseAxiosRequest = baseAxiosRequest;

  const baseIterableRequest = payload => {
    try {
      var _payload$validation, _payload$validation2;

      if ((_payload$validation = payload.validation) !== null && _payload$validation !== void 0 && _payload$validation.data && payload.data) {
        payload.validation.data.validateSync(payload.data, {
          abortEarly: false
        });
      }

      if ((_payload$validation2 = payload.validation) !== null && _payload$validation2 !== void 0 && _payload$validation2.params && payload.params) {
        payload.validation.params.validateSync(payload.params, {
          abortEarly: false
        });
      }

      return baseAxiosRequest(_objectSpread(_objectSpread({}, payload), {}, {
        baseURL: _config.config.getConfig('baseURL') || _constants.BASE_URL,
        headers: _objectSpread(_objectSpread({}, payload.headers), _constants.STATIC_HEADERS)
      }));
    } catch (error) {
      var _inner;

      /* match Iterable's API error schema and add client errors as a new key */
      const newError = {
        code: 'GenericError',
        msg: 'Client-side error',
        clientErrors: (_inner = error.inner) === null || _inner === void 0 ? void 0 : _inner.map(eachError => ({
          error: eachError.message,
          field: eachError.path
        }))
      };
      /* match Axios' Error object schema and reject */

      return Promise.reject({
        response: {
          data: newError,
          status: 400,
          statusText: '',
          headers: {},
          config: {}
        }
      });
    }
  };

  _exports.baseIterableRequest = baseIterableRequest;
});