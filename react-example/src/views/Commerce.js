var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { updateCart, trackPurchase } from '@iterable/web-sdk';
import TextField from '../components/TextField';
import { Button, EndpointWrapper, Form, Heading, Response } from './Components.styled';
export var Commerce = function () {
    var _a = __read(useState('Endpoint JSON goes here'), 2), updateCartResponse = _a[0], setUpdateCartResponse = _a[1];
    var _b = __read(useState('Endpoint JSON goes here'), 2), trackPurchaseResponse = _b[0], setTrackPurchaseResponse = _b[1];
    var _c = __read(useState(''), 2), cartItem = _c[0], setCartItem = _c[1];
    var _d = __read(useState(''), 2), purchaseItem = _d[0], setPurchaseItem = _d[1];
    var _e = __read(useState(false), 2), isUpdatingCart = _e[0], setUpdatingCart = _e[1];
    var _f = __read(useState(false), 2), isTrackingPurchase = _f[0], setTrackingPurchase = _f[1];
    var handleUpdateCart = function (e) {
        e.preventDefault();
        setUpdatingCart(true);
        updateCart({
            items: [{ name: cartItem, id: 'fdsafds', price: 100, quantity: 2 }]
        })
            .then(function (response) {
            setUpdateCartResponse(JSON.stringify(response.data));
            setUpdatingCart(false);
        })
            .catch(function (error) {
            setUpdateCartResponse(JSON.stringify(error.response.data));
            setUpdatingCart(false);
        });
    };
    var handleTrackPurchase = function (e) {
        e.preventDefault();
        setTrackingPurchase(true);
        trackPurchase({
            items: [{ name: purchaseItem, id: 'fdsafds', price: 100, quantity: 2 }],
            total: 200
        })
            .then(function (response) {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(response.data));
        })
            .catch(function (error) {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(error.response.data));
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("h1", { children: "Commerce Endpoints" }), _jsx(Heading, { children: "POST /updateCart" }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleUpdateCart, "data-qa-cart-submit": true }, { children: [_jsx("label", __assign({ htmlFor: "item-1" }, { children: "Enter Item Name" })), _jsx(TextField, { value: cartItem, onChange: function (e) { return setCartItem(e.target.value); }, id: "item-1", placeholder: "e.g. keyboard", "data-qa-cart-input": true }), _jsx(Button, __assign({ disabled: isUpdatingCart, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({ "data-qa-cart-response": true }, { children: updateCartResponse }))] }), _jsx(Heading, { children: "POST /trackPurchase" }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleTrackPurchase, "data-qa-purchase-submit": true }, { children: [_jsx("label", __assign({ htmlFor: "item-2" }, { children: "Enter Item Name" })), _jsx(TextField, { value: purchaseItem, onChange: function (e) { return setPurchaseItem(e.target.value); }, id: "item-2", placeholder: "e.g. keyboard", "data-qa-purchase-input": true }), _jsx(Button, __assign({ disabled: isTrackingPurchase, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({ "data-qa-purchase-response": true }, { children: trackPurchaseResponse }))] })] }));
};
export default Commerce;
