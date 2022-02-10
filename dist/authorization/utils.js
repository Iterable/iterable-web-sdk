(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "buffer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("buffer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buffer);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _buffer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getEpochExpiryTimeInMS = _exports.getEpochDifferenceInMS = void 0;

  const getEpochExpiryTimeInMS = jwt => {
    /** @thanks https://stackoverflow.com/a/38552302/7455960  */
    try {
      var _jwt$split, _JSON$parse;

      const base64Url = (_jwt$split = jwt.split('.')) === null || _jwt$split === void 0 ? void 0 : _jwt$split[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(_buffer.Buffer.from(base64, 'base64').toString().split('').map(character => '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const expTime = (_JSON$parse = JSON.parse(jsonPayload)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.exp;
      return expTime < 10000000000 ? expTime * 1000 : expTime;
    } catch {
      return 0;
    }
  };
  /*
    take two epoch timestamps and diff them and return them in MS.
    Also tries to convert seconds to MS if needed (since some server languages like 
    python deal with time in seconds).
  */


  _exports.getEpochExpiryTimeInMS = getEpochExpiryTimeInMS;

  const getEpochDifferenceInMS = (epochNow, epochFuture) => {
    let parsedNow = epochNow;
    let parsedFuture = epochFuture;

    if (epochNow < 10000000000) {
      /* convert to MS if in seconds */
      parsedNow = epochNow * 1000;
    }

    if (epochFuture < 10000000000) {
      /* convert to MS if in seconds */
      parsedFuture = epochFuture * 1000;
    }

    return parsedFuture - parsedNow;
  };

  _exports.getEpochDifferenceInMS = getEpochDifferenceInMS;
});