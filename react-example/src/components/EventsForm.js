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
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import TextField from './TextField';
import { Button, EndpointWrapper, Form, Heading, Response } from '../views/Components.styled';
export var EventsForm = function (_a) {
    var _b, _c, _d;
    var method = _a.method, endpointName = _a.endpointName, heading = _a.heading, needsEventName = _a.needsEventName;
    var _e = __read(useState('Endpoint JSON goes here'), 2), trackResponse = _e[0], setTrackResponse = _e[1];
    var _f = __read(useState(''), 2), trackEvent = _f[0], setTrackEvent = _f[1];
    var _g = __read(useState(false), 2), isTrackingEvent = _g[0], setTrackingEvent = _g[1];
    var handleTrack = function (e) {
        e.preventDefault();
        setTrackingEvent(true);
        var conditionalParams = needsEventName
            ? { eventName: trackEvent }
            : { messageId: trackEvent };
        method(__assign(__assign({}, conditionalParams), { deviceInfo: {
                appPackageName: 'my-website'
            } }))
            .then(function (response) {
            setTrackResponse(JSON.stringify(response.data));
            setTrackingEvent(false);
        })
            .catch(function (error) {
            setTrackResponse(JSON.stringify(error.response.data));
            setTrackingEvent(false);
        });
    };
    var formAttr = (_b = {}, _b["data-qa-".concat(endpointName, "-submit")] = true, _b);
    var inputAttr = (_c = {}, _c["data-qa-".concat(endpointName, "-input")] = true, _c);
    var responseAttr = (_d = {}, _d["data-qa-".concat(endpointName, "-response")] = true, _d);
    return (_jsxs(_Fragment, { children: [_jsxs(Heading, { children: ["POST ", heading] }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleTrack }, formAttr, { children: [_jsx("label", __assign({ htmlFor: "item-1" }, { children: needsEventName ? 'Enter Event Name' : 'Enter Message ID' })), _jsx(TextField, __assign({ value: trackEvent, onChange: function (e) { return setTrackEvent(e.target.value); }, id: "item-1", placeholder: needsEventName ? 'e.g. button-clicked' : 'e.g. df3fe3' }, inputAttr)), _jsx(Button, __assign({ disabled: isTrackingEvent, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({}, responseAttr, { children: trackResponse }))] })] }));
};
export default EventsForm;
