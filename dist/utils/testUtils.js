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
    global.testUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createClientError = void 0;

  const createClientError = clientErrors => ({
    response: {
      data: {
        code: 'GenericError',
        msg: 'Client-side error',
        clientErrors
      },
      status: 400,
      statusText: '',
      headers: {},
      config: {}
    }
  });

  _exports.createClientError = createClientError;
});