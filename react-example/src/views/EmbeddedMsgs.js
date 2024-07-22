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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { IterableEmbeddedCard, IterableEmbeddedNotification, IterableEmbeddedBanner, IterableEmbeddedManager, IterableConfig } from '@iterable/web-sdk';
import Button from '../components/Button';
import { useUser } from '../context/Users';
var StyleOverrides = {
    parent: {
        id: 'parent-id',
        styles: "\n      background: white;\n      border-color: purple;\n      border-radius: 30px;\n      padding: 10px;\n    "
    },
    img: {
        id: 'img-id',
        styles: ''
    },
    title: {
        id: 'title-id',
        styles: "\n      color: green;\n    "
    },
    primaryButton: {
        id: 'primary-button-id',
        styles: "\n      color: #8B0000;\n      background: #FFFFFF;\n    "
    },
    secondaryButton: {
        id: 'secondary-button-id',
        styles: '',
        disabledStyles: "\n        opacity: .6;\n        cursor: not-allowed;\n        background: grey;\n        color: grey;\n      "
    },
    body: {
        id: 'body-id',
        styles: "\n      color: green;\n    "
    },
    buttonsDiv: {
        id: 'buttons-div-id',
        styles: ''
    }
};
export var EmbeddedMsgs = function () {
    var loggedInUser = useUser().loggedInUser;
    var appPackageName = 'my-website';
    var _a = __read(useState(0), 2), selectedButtonIndex = _a[0], setSelectedButtonIndex = _a[1];
    var _b = __read(useState(false), 2), useCustomStyles = _b[0], setUseCustomStyles = _b[1];
    var _c = __read(useState([]), 2), messages = _c[0], setMessages = _c[1];
    var _d = __read(useState(new IterableEmbeddedManager(appPackageName)), 1), embeddedManager = _d[0];
    useEffect(function () {
        var urlHandler = {
            handleIterableURL: function (uri) {
                window.open(uri, '_blank');
                return true;
            }
        };
        IterableConfig.urlHandler = urlHandler;
        var customActionHandler = {
            handleIterableCustomAction: function (action) {
                if (action.data === 'news') {
                    // handle the custom action here and navigate based on action data
                    return true;
                }
                return false;
            }
        };
        IterableConfig.customActionHandler = customActionHandler;
    }, []);
    var handleFetchEmbeddedMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updateListener, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    updateListener = {
                        onMessagesUpdated: function () {
                            // this callback gets called when messages are fetched/updated
                            setMessages(embeddedManager.getMessages());
                        },
                        onEmbeddedMessagingDisabled: function () {
                            setMessages([]);
                        }
                    };
                    embeddedManager.addUpdateListener(updateListener);
                    return [4 /*yield*/, embeddedManager.syncMessages('my-website', function () {
                            console.log('messages', JSON.stringify(embeddedManager.getMessages()));
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log('error', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        if (loggedInUser === '') {
            setMessages([]);
        }
        else {
            handleFetchEmbeddedMessages();
        }
    }, [loggedInUser]);
    return (_jsxs(_Fragment, { children: [_jsx("div", __assign({ style: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                } }, { children: _jsxs("form", { children: [_jsxs("div", { children: [_jsx("input", { type: "radio", id: "default", name: "default", value: "default", checked: !useCustomStyles, onChange: function () { return setUseCustomStyles(false); } }), _jsx("label", { children: "Default OOTB Styles" })] }), _jsxs("div", { children: [_jsx("input", { type: "radio", id: "custom", name: "custom", value: "custom", checked: useCustomStyles, onChange: function () { return setUseCustomStyles(true); } }), _jsx("label", { children: "Custom OOTB Styles" })] })] }) })), _jsxs("div", __assign({ style: {
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: 10,
                    paddingBottom: 80,
                    marginTop: 20
                } }, { children: [_jsx(Button, __assign({ style: {
                            backgroundColor: selectedButtonIndex === 0 ? '#b4246b' : '#63abfb',
                            boxShadow: selectedButtonIndex === 0
                                ? '0 5px 0 0 #5a1236'
                                : '0 5px 0 0 #006be0fa'
                        }, disabled: selectedButtonIndex === 0, title: "Card", onClick: function () {
                            setSelectedButtonIndex(0);
                        } }, { children: "Card View" })), _jsx(Button, __assign({ style: {
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: selectedButtonIndex === 1 ? '#b4246b' : '#63abfb',
                            boxShadow: selectedButtonIndex === 1
                                ? '0 5px 0 0 #5a1236'
                                : '0 5px 0 0 #006be0fa'
                        }, disabled: selectedButtonIndex === 1, title: "Banner", onClick: function () {
                            setSelectedButtonIndex(1);
                        } }, { children: "Banner View" })), _jsx(Button, __assign({ style: {
                            backgroundColor: selectedButtonIndex === 2 ? '#b4246b' : '#63abfb',
                            boxShadow: selectedButtonIndex === 2
                                ? '0 5px 0 0 #5a1236'
                                : '0 5px 0 0 #006be0fa'
                        }, disabled: selectedButtonIndex === 2, title: "Notification", onClick: function () {
                            setSelectedButtonIndex(2);
                        } }, { children: "Notification View" }))] })), _jsx("div", __assign({ style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                } }, { children: messages.length > 0 ? (messages.map(function (message, index) {
                    switch (selectedButtonIndex) {
                        case 0: {
                            var card = IterableEmbeddedCard(__assign(__assign({ appPackageName: appPackageName, message: message }, (useCustomStyles && { htmlElements: StyleOverrides })), { errorCallback: function (error) { return console.log('handleError: ', error); } }));
                            return (_jsx("div", { dangerouslySetInnerHTML: { __html: card } }, message.metadata.messageId));
                        }
                        case 1: {
                            var banner = IterableEmbeddedBanner(__assign(__assign({ appPackageName: appPackageName, message: message }, (useCustomStyles && { htmlElements: StyleOverrides })), { errorCallback: function (error) { return console.log('handleError: ', error); } }));
                            return (_jsx("div", { dangerouslySetInnerHTML: { __html: banner } }, message.metadata.messageId));
                        }
                        case 2: {
                            var notification = IterableEmbeddedNotification(__assign(__assign({ appPackageName: appPackageName, message: message }, (useCustomStyles && { htmlElements: StyleOverrides })), { errorCallback: function (error) { return console.log('handleError: ', error); } }));
                            return (_jsx("div", { dangerouslySetInnerHTML: { __html: notification } }, message.metadata.messageId));
                        }
                        default:
                            return null;
                    }
                })) : (_jsx("div", { children: "No message" })) }))] }));
};
export default EmbeddedMsgs;
