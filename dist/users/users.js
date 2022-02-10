(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "yup", "../request", "./users.schema"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("yup"), require("../request"), require("./users.schema"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.yup, global.request, global.users);
    global.users = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _yup, _request, _users) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateUserEmail = _exports.updateUser = _exports.updateSubscriptions = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const updateUserEmail = newEmail => {
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/users/updateEmail',
      data: {
        newEmail
      },
      validation: {
        data: (0, _yup.object)().shape({
          newEmail: (0, _yup.string)().required()
        })
      }
    });
  };

  _exports.updateUserEmail = updateUserEmail;

  const updateUser = (payload = {}) => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/users/update',
      data: _objectSpread(_objectSpread({}, payload), {}, {
        preferUserId: true
      }),
      validation: {
        data: _users.updateUserSchema
      }
    });
  };

  _exports.updateUser = updateUser;

  const updateSubscriptions = (payload = {}) => {
    /* a customer could potentially send these up if they're not using TypeScript */
    delete payload.userId;
    delete payload.email;
    return (0, _request.baseIterableRequest)({
      method: 'POST',
      url: '/users/updateSubscriptions',
      data: payload,
      validation: {
        data: _users.updateSubscriptionsSchema
      }
    });
  };

  _exports.updateSubscriptions = updateSubscriptions;
});