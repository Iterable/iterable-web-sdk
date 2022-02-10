(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./inapp", "./types"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./inapp"), require("./types"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.inapp, global.types);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _inapp, _types) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_inapp).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _inapp[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _inapp[key];
      }
    });
  });
  Object.keys(_types).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _types[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _types[key];
      }
    });
  });
});