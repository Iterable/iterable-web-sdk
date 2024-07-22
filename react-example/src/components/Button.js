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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
var StyledButton = styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  text-align: center;\n  text-decoration: none;\n  width: 60%;\n  color: #000;\n  font-size: 1.2em;\n  background-color: #63abfb;\n  border: none;\n  border-radius: 5px;\n  padding: 1em;\n  -webkit-box-shadow: 0 5px 0 0 #006be0fa;\n  box-shadow: 0 5px 0 0 #006be0fa;\n  -webkit-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -moz-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -ms-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -o-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n\n  &:active {\n    background: #ab0457db;\n    border: none;\n    -webkit-box-shadow: 0 0 0 0 #006be0fa;\n    box-shadow: 0 0 0 0 #006be0fa;\n    -moz-transform: translateY(5px);\n    -webkit-transform: translateY(5px);\n    -o-transform: translateY(5px);\n    -ms-transform: translateY(5px);\n    transform: translateY(5px);\n  }\n"], ["\n  text-align: center;\n  text-decoration: none;\n  width: 60%;\n  color: #000;\n  font-size: 1.2em;\n  background-color: #63abfb;\n  border: none;\n  border-radius: 5px;\n  padding: 1em;\n  -webkit-box-shadow: 0 5px 0 0 #006be0fa;\n  box-shadow: 0 5px 0 0 #006be0fa;\n  -webkit-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -moz-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -ms-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -o-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n\n  &:active {\n    background: #ab0457db;\n    border: none;\n    -webkit-box-shadow: 0 0 0 0 #006be0fa;\n    box-shadow: 0 0 0 0 #006be0fa;\n    -moz-transform: translateY(5px);\n    -webkit-transform: translateY(5px);\n    -o-transform: translateY(5px);\n    -ms-transform: translateY(5px);\n    transform: translateY(5px);\n  }\n"])));
var DisabledButton = styled(StyledButton)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: gray;\n  color: #c7c7c7;\n  -webkit-box-shadow: 0 5px 0 0 #4d4d4d;\n  box-shadow: 0 5px 0 0 #4d4d4d;\n  cursor: not-allowed;\n\n  &:active {\n    background: gray;\n    border: none;\n    -webkit-box-shadow: 0 5px 0 0 #4d4d4d;\n    box-shadow: 0 5px 0 0 #4d4d4d;\n    -moz-transform: unset;\n    -webkit-transform: unset;\n    -o-transform: unset;\n    -ms-transform: unset;\n    transform: unset;\n  }\n"], ["\n  background-color: gray;\n  color: #c7c7c7;\n  -webkit-box-shadow: 0 5px 0 0 #4d4d4d;\n  box-shadow: 0 5px 0 0 #4d4d4d;\n  cursor: not-allowed;\n\n  &:active {\n    background: gray;\n    border: none;\n    -webkit-box-shadow: 0 5px 0 0 #4d4d4d;\n    box-shadow: 0 5px 0 0 #4d4d4d;\n    -moz-transform: unset;\n    -webkit-transform: unset;\n    -o-transform: unset;\n    -ms-transform: unset;\n    transform: unset;\n  }\n"])));
export var Button = function (props) {
    var children = props.children, disabled = props.disabled, rest = __rest(props, ["children", "disabled"]);
    if (disabled) {
        return (_jsx(DisabledButton, __assign({}, rest, { onClick: null, "aria-disabled": "true" }, { children: children })));
    }
    return _jsx(Button, __assign({}, rest, { children: children }));
};
export default Button;
var templateObject_1, templateObject_2;
