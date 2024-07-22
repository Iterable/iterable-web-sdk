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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { useState } from 'react';
import { IterableEmbeddedManager, trackEmbeddedSession, trackEmbeddedReceived, trackEmbeddedClick, trackEmbeddedDismiss } from '@iterable/web-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Button, EndpointWrapper, Form, Heading, Response } from '../views/Components.styled';
import TextField from './TextField';
export var TYPE_GET_RECEIVED = 0;
export var TYPE_POST_RECEIVED = 1;
export var TYPE_CLICK = 2;
export var TYPE_DISMISS = 3;
export var TYPE_SESSION = 4;
export var EmbeddedForm = function (_a) {
    var _b, _c, _d;
    var endpointName = _a.endpointName, heading = _a.heading, needsInputField = _a.needsInputField, type = _a.type;
    var _e = __read(useState('Endpoint JSON goes here'), 2), trackResponse = _e[0], setTrackResponse = _e[1];
    var _f = __read(useState(''), 2), messageId = _f[0], setMessageId = _f[1];
    var _g = __read(useState(false), 2), isTrackingEvent = _g[0], setTrackingEvent = _g[1];
    var startTime = new Date();
    startTime.setHours(startTime.getHours() - 2);
    var handleFetchEmbeddedMessages = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var updateListener, embeddedManager, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    updateListener = {
                        onMessagesUpdated: function () {
                            console.log('onMessagesUpdated called');
                        },
                        onEmbeddedMessagingDisabled: function () {
                            console.log('onEmbeddedMessagingDisabled called');
                        }
                    };
                    embeddedManager = new IterableEmbeddedManager('my-website');
                    embeddedManager.addUpdateListener(updateListener);
                    return [4 /*yield*/, embeddedManager.syncMessages('my-website', function () {
                            return console.log('Synced message');
                        })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    setTrackResponse(JSON.stringify((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.data));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var submitEmbeddedMessagesReceivedEvent = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var receivedMessage;
        return __generator(this, function (_a) {
            e.preventDefault();
            setTrackingEvent(true);
            receivedMessage = {
                messageId: messageId,
                appPackageName: 'my-lil-site'
            };
            trackEmbeddedReceived(receivedMessage.messageId, 'my-website')
                .then(function (response) {
                setTrackResponse(JSON.stringify(response.data));
                setTrackingEvent(false);
            })
                .catch(function (error) {
                setTrackResponse(JSON.stringify(error.response.data));
                setTrackingEvent(false);
            });
            return [2 /*return*/];
        });
    }); };
    var submitEmbeddedMessagesClickEvent = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, buttonIdentifier, targetUrl, appPackageName;
        return __generator(this, function (_a) {
            e.preventDefault();
            setTrackingEvent(true);
            payload = {
                messageId: messageId,
                campaignId: 1
            };
            buttonIdentifier = 'button-123';
            targetUrl = 'https://example.com';
            appPackageName = 'my-lil-site';
            trackEmbeddedClick({
                messageId: payload.messageId,
                buttonIdentifier: buttonIdentifier,
                targetUrl: targetUrl,
                appPackageName: appPackageName
            })
                .then(function (response) {
                setTrackResponse(JSON.stringify(response.data));
                setTrackingEvent(false);
            })
                .catch(function (error) {
                setTrackResponse(JSON.stringify(error.response.data));
                setTrackingEvent(false);
            });
            return [2 /*return*/];
        });
    }); };
    var submitEmbeddedMessagesDismissEvent = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var sessionData;
        return __generator(this, function (_a) {
            e.preventDefault();
            setTrackingEvent(true);
            sessionData = {
                messageId: messageId,
                buttonIdentifier: '123',
                deviceInfo: {
                    deviceId: '123',
                    platform: 'web',
                    appPackageName: 'my-website'
                },
                createdAt: Date.now()
            };
            trackEmbeddedDismiss(sessionData)
                .then(function (response) {
                setTrackResponse(JSON.stringify(response.data));
                setTrackingEvent(false);
            })
                .catch(function (error) {
                setTrackResponse(JSON.stringify(error.response.data));
                setTrackingEvent(false);
            });
            return [2 /*return*/];
        });
    }); };
    var submitEmbeddedSessionEvent = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var sessionData;
        return __generator(this, function (_a) {
            e.preventDefault();
            setTrackingEvent(true);
            sessionData = {
                session: {
                    id: uuidv4(),
                    start: startTime.getTime(),
                    end: Date.now()
                },
                impressions: [
                    {
                        messageId: messageId,
                        displayCount: 1,
                        displayDuration: 1000
                    }
                ],
                deviceInfo: {
                    deviceId: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    platform: 'Web',
                    appPackageName: 'my-lil-site'
                },
                appPackageName: 'my-website',
                createdAt: Date.now()
            };
            trackEmbeddedSession(sessionData)
                .then(function (response) {
                setTrackResponse(JSON.stringify(response.data));
                setTrackingEvent(false);
            })
                .catch(function (error) {
                setTrackResponse(JSON.stringify(error.response.data));
                setTrackingEvent(false);
            });
            return [2 /*return*/];
        });
    }); };
    var handleTrack = function (e, eventType) {
        if (eventType === TYPE_GET_RECEIVED) {
            handleFetchEmbeddedMessages(e);
        }
        else if (eventType === TYPE_POST_RECEIVED) {
            submitEmbeddedMessagesReceivedEvent(e);
        }
        else if (eventType === TYPE_CLICK) {
            submitEmbeddedMessagesClickEvent(e);
        }
        else if (eventType === TYPE_DISMISS) {
            submitEmbeddedMessagesDismissEvent(e);
        }
        else if (eventType === TYPE_SESSION) {
            submitEmbeddedSessionEvent(e);
        }
    };
    var formAttr = (_b = {}, _b["data-qa-".concat(endpointName, "-submit")] = true, _b);
    var inputAttr = (_c = {}, _c["data-qa-".concat(endpointName, "-input")] = true, _c);
    var responseAttr = (_d = {}, _d["data-qa-".concat(endpointName, "-response")] = true, _d);
    return (_jsxs(_Fragment, { children: [_jsx(Heading, { children: heading }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: function (e) { return handleTrack(e, type); } }, formAttr, { children: [needsInputField && (_jsxs(_Fragment, { children: [_jsx("label", __assign({ htmlFor: "item-1" }, { children: "Enter Message ID" })), _jsx(TextField, __assign({ value: messageId, onChange: function (e) { return setMessageId(e.target.value); }, id: "item-1", placeholder: 'e.g. df3fe3' }, inputAttr))] })), _jsx(Button, __assign({ disabled: isTrackingEvent, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({}, responseAttr, { children: trackResponse }))] })] }));
};
export default EmbeddedForm;
