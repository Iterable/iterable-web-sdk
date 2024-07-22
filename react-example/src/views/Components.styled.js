var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled from 'styled-components';
import _Button from '../components/Button';
export var Form = styled.form(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n  width: 45%;\n\n  @media (max-width: 850px) {\n    width: 100%;\n    margin-bottom: 2em;\n  }\n"], ["\n  display: flex;\n  flex-flow: column;\n  width: 45%;\n\n  @media (max-width: 850px) {\n    width: 100%;\n    margin-bottom: 2em;\n  }\n"])));
export var Response = styled.pre(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 45%;\n  white-space: break-spaces;\n  overflow-x: auto;\n\n  @media (max-width: 850px) {\n    width: 100%;\n  }\n"], ["\n  width: 45%;\n  white-space: break-spaces;\n  overflow-x: auto;\n\n  @media (max-width: 850px) {\n    width: 100%;\n  }\n"])));
export var EndpointWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: row;\n  width: 100%;\n  justify-content: space-between;\n\n  @media (max-width: 850px) {\n    display: block;\n  }\n"], ["\n  display: flex;\n  flex-flow: row;\n  width: 100%;\n  justify-content: space-between;\n\n  @media (max-width: 850px) {\n    display: block;\n  }\n"])));
export var Heading = styled.h2(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 3em;\n"], ["\n  margin-top: 3em;\n"])));
export var Button = styled(_Button)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 1em;\n"], ["\n  margin-top: 1em;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
