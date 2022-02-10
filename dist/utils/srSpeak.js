(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.srSpeak = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.srSpeak = _exports.default = void 0;

  /**
    sends aria-live messages when new content mounts. Useful for in-app messaging
    to let the user know an iframe message has opened
  
    @thanks https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
  */
  const srSpeak = (text, priority) => {
    const el = document.createElement('div');
    const id = 'speak-' + Math.random().toString(36).substr(2, 9);
    el.setAttribute('id', id);
    el.setAttribute('data-test-id', 'sr-speak');
    el.setAttribute('aria-live', priority || 'polite');
    /* 
      _display: none_ would cause the SR to not read the message so this just
      hides the message visibly, while still appearing in the DOM
      
      https://snook.ca/archives/html_and_css/hiding-content-for-accessibility 
    */

    el.style.cssText = `
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
  `;
    el.classList.add('sr-only');
    document.body.appendChild(el);
    const elementById = document.getElementById(id);

    if (elementById) {
      global.setTimeout(() => {
        elementById.innerText = text;
      }, 100);
      global.setTimeout(() => {
        document.body.removeChild(elementById);
      }, 1000);
    }
  };

  _exports.srSpeak = srSpeak;
  var _default = srSpeak;
  _exports.default = _default;
});