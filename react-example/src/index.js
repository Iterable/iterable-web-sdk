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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/camelcase */
import { initializeWithConfig } from '@iterable/web-sdk';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import Home from './views/Home';
import Commerce from './views/Commerce';
import Events from './views/Events';
import Users from './views/Users';
import InApp from './views/InApp';
import EmbeddedMessage from './views/Embedded';
import Link from './components/Link';
import LoginForm from './components/LoginForm';
import EmbeddedMsgs from './views/EmbeddedMsgs';
import { UserProvider } from './context/Users';
import EmbeddedMsgsImpressionTracker from './views/EmbeddedMsgsImpressionTracker';
import './styles/index.css';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n"], ["\n  display: flex;\n  flex-flow: column;\n"])));
var RouteWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 90%;\n  margin: 0 auto;\n"], ["\n  width: 90%;\n  margin: 0 auto;\n"])));
var HeaderWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  justify-content: space-between;\n  margin: 1em;\n"], ["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  justify-content: space-between;\n  margin: 1em;\n"])));
var HomeLink = styled(Link)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 100px;\n"], ["\n  width: 100px;\n"])));
(function () {
    var initializeParams = {
        authToken: process.env.API_KEY || '',
        configOptions: {
            isEuIterableService: false,
            dangerouslyAllowJsPopups: true
        },
        generateJWT: function (_a) {
            var email = _a.email, userID = _a.userID;
            return axios
                .post(process.env.JWT_GENERATOR || 'http://localhost:5000/generate', {
                exp_minutes: 2,
                email: email,
                user_id: userID,
                jwt_secret: process.env.JWT_SECRET
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (response) { var _a; return (_a = response.data) === null || _a === void 0 ? void 0 : _a.token; });
        }
    };
    var _a = initializeWithConfig(initializeParams), setEmail = _a.setEmail, setUserID = _a.setUserID, logout = _a.logout, refreshJwtToken = _a.refreshJwtToken;
    var container = document.getElementById('root');
    var root = createRoot(container);
    root.render(_jsx(BrowserRouter, { children: _jsx(Wrapper, { children: _jsxs(UserProvider, { children: [_jsxs(HeaderWrapper, { children: [_jsx(HomeLink, __assign({ renderAsButton: true, to: "/" }, { children: "Home" })), _jsx(LoginForm, { setEmail: setEmail, setUserId: setUserID, logout: logout, refreshJwt: refreshJwtToken })] }), _jsx(RouteWrapper, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/commerce", element: _jsx(Commerce, {}) }), _jsx(Route, { path: "/events", element: _jsx(Events, {}) }), _jsx(Route, { path: "/users", element: _jsx(Users, {}) }), _jsx(Route, { path: "/inApp", element: _jsx(InApp, {}) }), _jsx(Route, { path: "/embedded-msgs", element: _jsx(EmbeddedMsgs, {}) }), _jsx(Route, { path: "/embedded", element: _jsx(EmbeddedMessage, {}) }), _jsx(Route, { path: "/embedded-msgs-impression-tracker", element: _jsx(EmbeddedMsgsImpressionTracker, {}) })] }) })] }) }) }));
})();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
