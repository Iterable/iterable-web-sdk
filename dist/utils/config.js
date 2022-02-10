(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../constants"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../constants"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.constants);
    global.config = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.config = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const _config = () => {
    let options = {
      logLevel: 'none',
      baseURL: _constants.BASE_URL
    };
    return {
      getConfig: option => options[option],
      setConfig: newOptions => {
        options = _objectSpread(_objectSpread({}, options), newOptions);
      }
    };
  };

  const config = _config();

  _exports.config = config;
  var _default = config;
  _exports.default = _default;
});