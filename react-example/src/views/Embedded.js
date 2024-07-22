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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { initialize } from '@iterable/web-sdk';
import EmbeddedForm, { TYPE_CLICK, TYPE_DISMISS, TYPE_GET_RECEIVED, TYPE_POST_RECEIVED, TYPE_SESSION } from '../components/EmbeddedForm';
import TextField from '../components/TextField';
export var EmbeddedMessage = function () {
    var _a = __read(useState(), 2), userId = _a[0], setUserId = _a[1];
    useEffect(function () {
        initialize(process.env.API_KEY);
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("h1", { children: "Embedded Message" }), _jsx("label", __assign({ htmlFor: "item-1" }, { children: "UserId" })), _jsx(TextField, { value: userId, onChange: function (e) { return setUserId(e.target.value); }, id: "item-1", placeholder: "e.g. phone_number", "data-qa-update-user-input": true, required: true }), _jsx("br", {}), _jsx(EmbeddedForm, { heading: "GET /embedded-messaging/events/received", endpointName: "received-get", type: TYPE_GET_RECEIVED }), _jsx("br", {}), _jsx(EmbeddedForm, { heading: "POST /embedded-messaging/events/received", endpointName: "received-post", type: TYPE_POST_RECEIVED, needsInputField: true }), _jsx("br", {}), _jsx(EmbeddedForm, { heading: "POST /embedded-messaging/events/click", endpointName: "click", type: TYPE_CLICK, needsInputField: true }), _jsx("br", {}), _jsx(EmbeddedForm, { heading: "POST /embedded-messaging/events/dismiss", endpointName: "dismiss", needsInputField: true, type: TYPE_DISMISS }), _jsx("br", {}), _jsx(EmbeddedForm, { heading: "POST /embedded-messaging/events/session", endpointName: "session", needsInputField: true, type: TYPE_SESSION }), _jsx("br", {})] }));
};
export default EmbeddedMessage;
