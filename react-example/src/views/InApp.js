var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import styled from 'styled-components';
import { DisplayOptions, getInAppMessages } from '@iterable/web-sdk';
import _Button from '../components/Button';
import { useUser } from '../context/Users';
import { EndpointWrapper, Heading, Response } from './Components.styled';
var Button = styled(_Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  margin-bottom: 1em;\n"], ["\n  width: 100%;\n  margin-bottom: 1em;\n"])));
var GetMessagesRawButton = styled(Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 45%;\n  max-height: 61px;\n\n  @media (max-width: 850px) {\n    width: 100%;\n  }\n"], ["\n  width: 45%;\n  max-height: 61px;\n\n  @media (max-width: 850px) {\n    width: 100%;\n  }\n"])));
var AutoDisplayContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 65%;\n  margin: 0 auto;\n\n  @media (max-width: 850px) {\n    width: 85%;\n  }\n"], ["\n  width: 65%;\n  margin: 0 auto;\n\n  @media (max-width: 850px) {\n    width: 85%;\n  }\n"])));
var _a = getInAppMessages({
    count: 20,
    packageName: 'my-website',
    closeButton: {},
    displayInterval: 1000
}, { display: DisplayOptions.Immediate }), request = _a.request, pauseMessageStream = _a.pauseMessageStream, resumeMessageStream = _a.resumeMessageStream;
export var InApp = function () {
    var _a = __read(useState(false), 2), isGettingMessagesRaw = _a[0], setIsGettingMessagesRaw = _a[1];
    var _b = __read(useState(false), 2), isGettingMessagesAuto = _b[0], setIsGettingMessagesAuto = _b[1];
    var _c = __read(useState('Endpoint JSON goes here'), 2), getMessagesResponse = _c[0], setGetMessagesResponse = _c[1];
    var loggedInUser = useUser().loggedInUser;
    var _d = __read(useState(null), 2), rawMessageCount = _d[0], setRawMessageCount = _d[1];
    var _e = __read(useState(null), 2), autoMessageCount = _e[0], setAutoMessageCount = _e[1];
    var _f = __read(useState(false), 2), isPaused = _f[0], setIsPaused = _f[1];
    var getMessagesRaw = function (e) {
        e.preventDefault();
        setIsGettingMessagesRaw(true);
        return getInAppMessages({ count: 20, packageName: 'my-website' }, { display: DisplayOptions.Deferred })
            .request()
            .then(function (response) {
            setRawMessageCount(response.data.inAppMessages.length);
            setIsGettingMessagesRaw(false);
            setGetMessagesResponse(JSON.stringify(response.data, null, 2));
        })
            .catch(function (error) {
            setIsGettingMessagesRaw(false);
            setGetMessagesResponse(JSON.stringify(error.response.data, null, 2));
        });
    };
    var getMessagesAutoDisplay = function (e) {
        setIsPaused(false);
        e.preventDefault();
        setIsGettingMessagesAuto(true);
        return request()
            .then(function (response) {
            setAutoMessageCount(response.data.inAppMessages.length);
            setIsGettingMessagesAuto(false);
        })
            .catch(function () {
            setIsGettingMessagesAuto(false);
        });
    };
    var handlePause = function () {
        setIsPaused(true);
        pauseMessageStream();
    };
    var handleResume = function () {
        setIsPaused(false);
        resumeMessageStream();
    };
    return (_jsxs(_Fragment, { children: [_jsx("h1", { children: "inApp Endpoints" }), _jsx(Heading, { children: "POST /inApp/web/getMessages (auto-display)" }), _jsxs(AutoDisplayContainer, { children: [_jsx(Button, __assign({ disabled: !loggedInUser || isGettingMessagesAuto, onClick: getMessagesAutoDisplay, "data-qa-auto-display-messages": true }, { children: typeof autoMessageCount === 'number'
                            ? "Retrieved ".concat(autoMessageCount, " messages (try again)")
                            : 'Get Messages (auto-display)' })), _jsx(Button, __assign({ disabled: !loggedInUser ||
                            isGettingMessagesAuto ||
                            isPaused ||
                            !autoMessageCount, onClick: handlePause, "data-qa-pause-messages": true }, { children: isPaused ? 'Paused' : 'Pause Message Stream' })), _jsx(Button, __assign({ disabled: !loggedInUser ||
                            isGettingMessagesAuto ||
                            !isPaused ||
                            !autoMessageCount, onClick: handleResume, "data-qa-resume-messages": true }, { children: "Resume Message Stream" }))] }), _jsx(Heading, { children: "POST /inApp/web/getMessages" }), _jsxs(EndpointWrapper, { children: [_jsx(GetMessagesRawButton, __assign({ disabled: !loggedInUser || isGettingMessagesRaw, onClick: getMessagesRaw, "data-qa-get-messages-raw": true }, { children: typeof rawMessageCount === 'number'
                            ? "Retrieved ".concat(rawMessageCount, " messages (try again)")
                            : 'Get Messages (do not auto-display)' })), _jsx(Response, __assign({ "data-qa-get-messages-raw-response": true }, { children: getMessagesResponse }))] })] }));
};
export default InApp;
var templateObject_1, templateObject_2, templateObject_3;
