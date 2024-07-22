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
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import _TextField from './TextField';
import _Button from './Button';
import { useUser } from '../context/Users';
var TextField = styled(_TextField)(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
var Button = styled(_Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-left: 0.4em;\n  max-width: 425px;\n"], ["\n  margin-left: 0.4em;\n  max-width: 425px;\n"])));
var Form = styled.form(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  justify-content: flex-end;\n  height: 100%;\n\n  ", " {\n    align-self: stretch;\n    margin-top: 5px;\n  }\n"], ["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  justify-content: flex-end;\n  height: 100%;\n\n  ", " {\n    align-self: stretch;\n    margin-top: 5px;\n  }\n"])), TextField);
var StyledDiv = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n"])));
var Error = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: red;\n"], ["\n  color: red;\n"])));
export var LoginForm = function (_a) {
    var setEmail = _a.setEmail, setUserId = _a.setUserId, logout = _a.logout, refreshJwt = _a.refreshJwt;
    var _b = __read(useState(true), 2), useEmail = _b[0], setUseEmail = _b[1];
    var _c = __read(useState(process.env.LOGIN_EMAIL || ''), 2), user = _c[0], updateUser = _c[1];
    var _d = __read(useState(''), 2), error = _d[0], setError = _d[1];
    var _e = __read(useState(false), 2), isEditingUser = _e[0], setEditingUser = _e[1];
    var _f = useUser(), loggedInUser = _f.loggedInUser, setLoggedInUser = _f.setLoggedInUser;
    var handleSubmit = function (e) {
        e.preventDefault();
        var setUser = useEmail ? setEmail : setUserId;
        setUser(user)
            .then(function () {
            setEditingUser(false);
            setLoggedInUser({ type: 'user_update', data: user });
        })
            .catch(function () { return setError('Something went wrong!'); });
    };
    var handleLogout = function () {
        logout();
        setLoggedInUser({ type: 'user_update', data: '' });
    };
    var handleJwtRefresh = function () {
        refreshJwt(user);
    };
    var handleEditUser = function () {
        updateUser(loggedInUser);
        setEditingUser(true);
    };
    var handleCancelEditUser = function () {
        updateUser('');
        setEditingUser(false);
    };
    var handleRadioChange = function (e) {
        setUseEmail(e.target.value === 'email');
    };
    var first5 = loggedInUser.substring(0, 5);
    var last9 = loggedInUser.substring(loggedInUser.length - 9);
    return (_jsx(_Fragment, { children: loggedInUser && !isEditingUser ? (_jsxs(_Fragment, { children: [_jsxs(Button, __assign({ onClick: handleEditUser }, { children: ["Logged in as ", "".concat(first5, "...").concat(last9), " (change)"] })), _jsx(Button, __assign({ onClick: handleJwtRefresh }, { children: "Manually Refresh JWT Token" })), _jsx(Button, __assign({ onClick: handleLogout }, { children: "Logout" }))] })) : (_jsxs(StyledDiv, { children: [_jsxs(Form, { children: [_jsxs("div", { children: [_jsx("input", { type: "radio", id: "userId", name: "userId", value: "userId", checked: !useEmail, onChange: handleRadioChange }), _jsx("label", { children: "UserId" })] }), _jsxs("div", { children: [_jsx("input", { type: "radio", id: "email", name: "email", value: "email", checked: useEmail, onChange: handleRadioChange }), _jsx("label", { children: "Email" })] })] }), _jsxs(Form, __assign({ onSubmit: handleSubmit, "data-qa-login-form": true }, { children: [_jsx(TextField, { onChange: function (e) { return updateUser(e.target.value); }, value: user, placeholder: "e.g. hello@gmail.com", required: true, "data-qa-login-input": true }), _jsx(Button, __assign({ type: "submit" }, { children: isEditingUser ? 'Change' : 'Login' })), isEditingUser && (_jsx(Button, __assign({ onClick: handleCancelEditUser }, { children: "Cancel" })))] })), error && _jsx(Error, { children: error })] })) }));
};
export default LoginForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
