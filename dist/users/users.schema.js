(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "yup"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("yup"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.yup);
    global.usersSchema = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _yup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateUserSchema = _exports.updateSubscriptionsSchema = void 0;
  const updateUserSchema = (0, _yup.object)().shape({
    dataFields: (0, _yup.object)(),
    preferUserId: (0, _yup.boolean)(),
    mergeNestedObjects: (0, _yup.boolean)()
  });
  _exports.updateUserSchema = updateUserSchema;
  const updateSubscriptionsSchema = (0, _yup.object)().shape({
    emailListIds: (0, _yup.array)((0, _yup.number)()),
    unsubscribedChannelIds: (0, _yup.array)((0, _yup.number)()),
    unsubscribedMessageTypeIds: (0, _yup.array)((0, _yup.number)()),
    subscribedMessageTypeIds: (0, _yup.array)((0, _yup.number)()),
    campaignId: (0, _yup.number)(),
    templateId: (0, _yup.number)()
  });
  _exports.updateSubscriptionsSchema = updateSubscriptionsSchema;
});