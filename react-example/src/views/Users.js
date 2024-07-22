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
import { updateUser, updateSubscriptions, updateUserEmail } from '@iterable/web-sdk';
import TextField from '../components/TextField';
import { useUser } from '../context/Users';
import { Button, EndpointWrapper, Form, Heading, Response } from './Components.styled';
export var Users = function () {
    var _a = useUser(), loggedInUser = _a.loggedInUser, setLoggedInUser = _a.setLoggedInUser;
    var _b = __read(useState('Endpoint JSON goes here'), 2), updateUserResponse = _b[0], setUpdateUserResponse = _b[1];
    var _c = __read(useState('Endpoint JSON goes here'), 2), updateUserEmailResponse = _c[0], setUpdateUserEmailResponse = _c[1];
    var _d = __read(useState('Endpoint JSON goes here'), 2), updateSubscriptionsResponse = _d[0], setUpdateSubscriptionsResponse = _d[1];
    var _e = __read(useState(''), 2), userDataField = _e[0], setUserDataField = _e[1];
    var _f = __read(useState(''), 2), email = _f[0], setEmail = _f[1];
    var _g = __read(useState(''), 2), emailListID = _g[0], setEmailListID = _g[1];
    var _h = __read(useState(false), 2), isUpdatingUser = _h[0], setUpdatingUser = _h[1];
    var _j = __read(useState(false), 2), isUpdatingUserEmail = _j[0], setUpdatingUserEmail = _j[1];
    var _k = __read(useState(false), 2), isUpdatingSubscriptions = _k[0], setUpdatingSubscriptions = _k[1];
    var handleUpdateUser = function (e) {
        var _a;
        e.preventDefault();
        setUpdatingUser(true);
        updateUser({
            dataFields: (_a = {}, _a[userDataField] = 'test-data', _a)
        })
            .then(function (response) {
            setUpdateUserResponse(JSON.stringify(response.data));
            setUpdatingUser(false);
        })
            .catch(function (error) {
            setUpdateUserResponse(JSON.stringify(error.response.data));
            setUpdatingUser(false);
        });
    };
    var handleUpdateUserEmail = function (e) {
        e.preventDefault();
        setUpdatingUserEmail(true);
        updateUserEmail(email)
            .then(function (response) {
            setUpdatingUserEmail(false);
            setUpdateUserEmailResponse(JSON.stringify(response.data));
            setLoggedInUser({ type: 'user_update', data: email });
        })
            .catch(function (error) {
            setUpdatingUserEmail(false);
            setUpdateUserEmailResponse(JSON.stringify(error.response.data));
        });
    };
    var handleUpdateSubscriptions = function (e) {
        e.preventDefault();
        setUpdatingSubscriptions(true);
        updateSubscriptions({ emailListIds: [+emailListID] })
            .then(function (response) {
            setUpdatingSubscriptions(false);
            setUpdateSubscriptionsResponse(JSON.stringify(response.data));
        })
            .catch(function (error) {
            setUpdatingSubscriptions(false);
            setUpdateSubscriptionsResponse(JSON.stringify(error.response.data));
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("h1", { children: "Users Endpoints" }), _jsx(Heading, { children: "POST /users/update" }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleUpdateUser, "data-qa-update-user-submit": true }, { children: [_jsx("label", __assign({ htmlFor: "item-1" }, { children: "Enter Data Field Name (value will be \"test-data\")" })), _jsx(TextField, { value: userDataField, onChange: function (e) { return setUserDataField(e.target.value); }, id: "item-1", placeholder: "e.g. phone_number", "data-qa-update-user-input": true, required: true }), _jsx(Button, __assign({ disabled: isUpdatingUser, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({ "data-qa-update-user-response": true }, { children: updateUserResponse }))] }), _jsx(Heading, { children: "POST /users/updateUserEmail" }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleUpdateUserEmail, "data-qa-update-user-email-submit": true }, { children: [_jsxs("label", __assign({ htmlFor: "item-1" }, { children: ["Enter New Email (changing from ", loggedInUser, ")"] })), _jsx(TextField, { value: email, onChange: function (e) { return setEmail(e.target.value); }, id: "item-1", placeholder: "e.g. hello@gmail.com", "data-qa-update-user-email-input": true, type: "email", required: true }), _jsx(Button, __assign({ disabled: isUpdatingUserEmail, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({ "data-qa-update-user-email-response": true }, { children: updateUserEmailResponse }))] }), _jsx(Heading, { children: "POST /users/updateSubscriptions" }), _jsxs(EndpointWrapper, { children: [_jsxs(Form, __assign({ onSubmit: handleUpdateSubscriptions, "data-qa-update-subscriptions-submit": true }, { children: [_jsx("label", __assign({ htmlFor: "item-1" }, { children: "Enter new email list ID" })), _jsx(TextField, { value: emailListID, onChange: function (e) { return setEmailListID(e.target.value); }, id: "item-1", placeholder: "e.g. 2", "data-qa-update-subscriptions-input": true, type: "tel", required: true }), _jsx(Button, __assign({ disabled: isUpdatingSubscriptions, type: "submit" }, { children: "Submit" }))] })), _jsx(Response, __assign({ "data-qa-update-subscriptions-response": true }, { children: updateSubscriptionsResponse }))] })] }));
};
export default Users;
