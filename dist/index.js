(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./authorization", "./users", "./inapp", "./request", "./events", "./commerce", "./utils/config"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./authorization"), require("./users"), require("./inapp"), require("./request"), require("./events"), require("./commerce"), require("./utils/config"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.authorization, global.users, global.inapp, global.request, global.events, global.commerce, global.config);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _authorization, _users, _inapp, _request, _events, _commerce, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    config: true
  };
  Object.defineProperty(_exports, "config", {
    enumerable: true,
    get: function () {
      return _config.config;
    }
  });
  Object.keys(_authorization).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _authorization[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _authorization[key];
      }
    });
  });
  Object.keys(_users).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _users[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _users[key];
      }
    });
  });
  Object.keys(_inapp).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _inapp[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _inapp[key];
      }
    });
  });
  Object.keys(_request).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _request[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _request[key];
      }
    });
  });
  Object.keys(_events).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _events[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _events[key];
      }
    });
  });
  Object.keys(_commerce).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in _exports && _exports[key] === _commerce[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _commerce[key];
      }
    });
  });
});