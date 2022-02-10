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
    global.inappSchema = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _yup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.inAppMessagesParamSchema = _exports.default = void 0;
  const inAppMessagesParamSchema = (0, _yup.object)().shape({
    displayInterval: (0, _yup.number)(),
    onOpenScreenReaderMessage: (0, _yup.string)(),
    onOpenNodeToTakeFocus: (0, _yup.string)(),
    count: (0, _yup.number)().required(),
    packageName: (0, _yup.string)().required(),
    platform: (0, _yup.string)().required()
  });
  _exports.inAppMessagesParamSchema = inAppMessagesParamSchema;
  var _default = inAppMessagesParamSchema;
  _exports.default = _default;
});