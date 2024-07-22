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
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer } from 'react';
var initialState = '';
export var reducer = function (state, action) {
    switch (action.type) {
        case 'user_update':
            return action.data;
        default:
            return state;
    }
};
export var UserContext = createContext({
    loggedInUser: initialState,
    setLoggedInUser: function () { return null; }
});
export var UserProvider = function (_a) {
    var children = _a.children;
    var _b = __read(useReducer(reducer, initialState), 2), loggedInUser = _b[0], setLoggedInUser = _b[1];
    return (_jsx(UserContext.Provider, __assign({ value: { loggedInUser: loggedInUser, setLoggedInUser: setLoggedInUser } }, { children: children })));
};
export var useUser = function () { return useContext(UserContext); };
