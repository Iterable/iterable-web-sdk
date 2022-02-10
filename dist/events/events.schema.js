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
    global.eventsSchema = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _yup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.trackSchema = _exports.eventRequestSchema = void 0;
  const trackSchema = (0, _yup.object)().shape({
    eventName: (0, _yup.string)().required(),
    id: (0, _yup.string)(),
    createdAt: (0, _yup.number)(),
    dataFields: (0, _yup.object)(),
    campaignId: (0, _yup.number)(),
    templateId: (0, _yup.number)()
  });
  _exports.trackSchema = trackSchema;
  const eventRequestSchema = (0, _yup.object)().shape({
    messageId: (0, _yup.string)().required(),
    clickedUrl: (0, _yup.string)(),
    messageContext: (0, _yup.object)().shape({
      saveToInbox: (0, _yup.boolean)(),
      silentInbox: (0, _yup.boolean)(),
      location: (0, _yup.string)()
    }),
    closeAction: (0, _yup.string)(),
    deviceInfo: (0, _yup.object)().shape({
      deviceId: (0, _yup.string)().required(),
      platform: (0, _yup.string)().required(),
      appPackageName: (0, _yup.string)().required()
    }).required(),
    inboxSessionId: (0, _yup.string)(),
    createdAt: (0, _yup.number)()
  });
  _exports.eventRequestSchema = eventRequestSchema;
});