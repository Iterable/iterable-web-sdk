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
    global.commerceSchema = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _yup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateCartSchema = _exports.trackPurchaseSchema = void 0;
  const userShape = (0, _yup.object)().shape({
    dataFields: (0, _yup.object)(),
    preferUserId: (0, _yup.boolean)(),
    mergeNestedObjects: (0, _yup.boolean)()
  });
  const itemShape = (0, _yup.object)().shape({
    id: (0, _yup.string)().required(),
    sku: (0, _yup.string)(),
    name: (0, _yup.string)().required(),
    description: (0, _yup.string)(),
    categories: (0, _yup.array)((0, _yup.string)()),
    price: (0, _yup.number)().required(),
    quantity: (0, _yup.number)().required(),
    imageUrl: (0, _yup.string)(),
    url: (0, _yup.string)(),
    dataFields: (0, _yup.object)()
  });
  const updateCartSchema = (0, _yup.object)().shape({
    user: userShape,
    items: (0, _yup.array)(itemShape).required()
  });
  _exports.updateCartSchema = updateCartSchema;
  const trackPurchaseSchema = (0, _yup.object)().shape({
    id: (0, _yup.string)(),
    user: userShape,
    items: (0, _yup.array)(itemShape).required(),
    campaignId: (0, _yup.string)(),
    templateId: (0, _yup.string)(),
    total: (0, _yup.number)().required(),
    createdAt: (0, _yup.number)(),
    dataFields: (0, _yup.object)()
  });
  _exports.trackPurchaseSchema = trackPurchaseSchema;
});