(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./types", "./commerce"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./types"), require("./commerce"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.types, global.commerce);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _types, _commerce) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
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
  Object.keys(_commerce).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _commerce[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _commerce[key];
      }
    });
  });
});