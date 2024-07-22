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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import styled from 'styled-components';
import _Link from '../components/Link';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n"], ["\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n"])));
var Link = styled(_Link)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 1em;\n"], ["\n  margin-top: 1em;\n"])));
export var Home = function () { return (_jsxs(_Fragment, { children: [_jsx("h1", { children: "Namespace Selection" }), _jsxs(Wrapper, { children: [_jsx(Link, __assign({ to: "/commerce", renderAsButton: true }, { children: "Commerce" })), _jsx(Link, __assign({ to: "/events", renderAsButton: true }, { children: "Events" })), _jsx(Link, __assign({ to: "/users", renderAsButton: true }, { children: "Users" })), _jsx(Link, __assign({ to: "/inApp", renderAsButton: true }, { children: "inApp" })), _jsx(Link, __assign({ to: "/embedded-msgs", renderAsButton: true }, { children: "Embedded Msgs" })), _jsx(Link, __assign({ to: "/embedded", renderAsButton: true }, { children: "embedded" })), _jsx(Link, __assign({ to: "/embedded-msgs-impression-tracker", renderAsButton: true }, { children: "Embedded msgs impressions tracker" }))] })] })); };
export default Home;
var templateObject_1, templateObject_2;
