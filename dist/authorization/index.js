(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./authorization"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./authorization"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.authorization);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _authorization) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_authorization).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _authorization[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _authorization[key];
      }
    });
  });
});