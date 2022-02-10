(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "throttle-debounce", "../request", "./utils", "../events", "../constants", "./inapp.schema"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("throttle-debounce"), require("../request"), require("./utils"), require("../events"), require("../constants"), require("./inapp.schema"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.throttleDebounce, global.request, global.utils, global.events, global.constants, global.inapp);
    global.inapp = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _throttleDebounce, _request, _utils, _events, _constants, _inapp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.clearMessages = void 0;
  _exports.getInAppMessages = getInAppMessages;
  _inapp = _interopRequireDefault(_inapp);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  let parsedMessages = [];
  let timer = null;
  let messageIndex = 0;

  const clearMessages = () => {
    parsedMessages = [];
    messageIndex = 0;

    if (timer) {
      clearTimeout(timer);
    }
  };

  _exports.clearMessages = clearMessages;

  function getInAppMessages(payload, showInAppMessagesAutomatically) {
    clearMessages();

    const dupedPayload = _objectSpread({}, payload);
    /* delete SDK-defined payload props and email and userId */


    delete dupedPayload.userId;
    delete dupedPayload.email;
    delete dupedPayload.displayInterval;
    delete dupedPayload.onOpenScreenReaderMessage;
    delete dupedPayload.onOpenNodeToTakeFocus;
    delete dupedPayload.topOffset;
    delete dupedPayload.bottomOffset;
    delete dupedPayload.rightOffset;
    delete dupedPayload.animationDuration;
    delete dupedPayload.handleLinks;

    if (showInAppMessagesAutomatically) {
      (0, _utils.addStyleSheet)(document, (0, _constants.ANIMATION_STYLESHEET)(payload.animationDuration));

      const paintMessageToDOM = () => {
        var _parsedMessages;

        if ((_parsedMessages = parsedMessages) !== null && _parsedMessages !== void 0 && _parsedMessages[messageIndex]) {
          var _activeMessage$conten, _activeMessage$conten2, _activeMessage$conten3, _activeMessage$conten4, _activeMessage$conten7, _activeMessage$conten8, _activeMessage$conten9, _activeMessage$conten10, _activeMessage$conten11, _activeMessage$conten12;

          const activeMessage = parsedMessages[messageIndex];
          const shouldAnimate = activeMessage === null || activeMessage === void 0 ? void 0 : (_activeMessage$conten = activeMessage.content) === null || _activeMessage$conten === void 0 ? void 0 : (_activeMessage$conten2 = _activeMessage$conten.inAppDisplaySettings) === null || _activeMessage$conten2 === void 0 ? void 0 : _activeMessage$conten2.shouldAnimate;
          const position = (activeMessage === null || activeMessage === void 0 ? void 0 : (_activeMessage$conten3 = activeMessage.content) === null || _activeMessage$conten3 === void 0 ? void 0 : (_activeMessage$conten4 = _activeMessage$conten3.webInAppDisplaySettings) === null || _activeMessage$conten4 === void 0 ? void 0 : _activeMessage$conten4.position) || 'Center';

          const dismissMessage = (activeIframe, url) => {
            var _activeMessage$conten5, _activeMessage$conten6;

            if (activeMessage !== null && activeMessage !== void 0 && (_activeMessage$conten5 = activeMessage.content) !== null && _activeMessage$conten5 !== void 0 && (_activeMessage$conten6 = _activeMessage$conten5.inAppDisplaySettings) !== null && _activeMessage$conten6 !== void 0 && _activeMessage$conten6.shouldAnimate) {
              activeIframe.className = position === 'Center' || position === 'Full' ? 'fade-out' : 'slide-out';
            }
            /* close the message and start a timer to show the next one */


            (0, _events.trackInAppClose)(url ? {
              messageId: activeMessage.messageId,
              clickedUrl: url,
              deviceInfo: {
                appPackageName: dupedPayload.packageName
              }
            } : {
              messageId: activeMessage.messageId,
              deviceInfo: {
                appPackageName: dupedPayload.packageName
              }
            }).catch(e => e);

            if (shouldAnimate) {
              const animationTimer = global.setTimeout(() => {
                activeIframe.remove();
                clearTimeout(animationTimer);
              }, _constants.ANIMATION_DURATION);
            } else {
              activeIframe.remove();
            }

            const timeToNextMessage = shouldAnimate ? (payload.displayInterval || _constants.DISPLAY_INTERVAL_DEFAULT) + _constants.ANIMATION_DURATION : payload.displayInterval || _constants.DISPLAY_INTERVAL_DEFAULT;
            messageIndex += 1;
            timer = global.setTimeout(() => {
              clearTimeout(timer);
              paintMessageToDOM();
            }, timeToNextMessage);
          };

          const overlay = (0, _utils.paintOverlay)(activeMessage === null || activeMessage === void 0 ? void 0 : (_activeMessage$conten7 = activeMessage.content) === null || _activeMessage$conten7 === void 0 ? void 0 : (_activeMessage$conten8 = _activeMessage$conten7.inAppDisplaySettings) === null || _activeMessage$conten8 === void 0 ? void 0 : (_activeMessage$conten9 = _activeMessage$conten8.bgColor) === null || _activeMessage$conten9 === void 0 ? void 0 : _activeMessage$conten9.hex, activeMessage === null || activeMessage === void 0 ? void 0 : (_activeMessage$conten10 = activeMessage.content) === null || _activeMessage$conten10 === void 0 ? void 0 : (_activeMessage$conten11 = _activeMessage$conten10.inAppDisplaySettings) === null || _activeMessage$conten11 === void 0 ? void 0 : (_activeMessage$conten12 = _activeMessage$conten11.bgColor) === null || _activeMessage$conten12 === void 0 ? void 0 : _activeMessage$conten12.alpha, shouldAnimate);
          /* add the message's html to an iframe and paint it to the DOM */

          return (0, _utils.paintIFrame)(activeMessage.content.html, position, shouldAnimate, payload.onOpenScreenReaderMessage || 'in-app iframe message opened', payload.topOffset, payload.bottomOffset, payload.rightOffset).then(activeIframe => {
            var _activeIframe$content10, _activeIframe$content14, _activeIframe$content17, _activeIframe$content18;

            const throttledResize = position !== 'Full' ? (0, _throttleDebounce.throttle)(750, () => {
              var _activeIframe$content, _activeIframe$content2, _activeIframe$content3;

              activeIframe.style.height = (((_activeIframe$content = activeIframe.contentWindow) === null || _activeIframe$content === void 0 ? void 0 : (_activeIframe$content2 = _activeIframe$content.document) === null || _activeIframe$content2 === void 0 ? void 0 : (_activeIframe$content3 = _activeIframe$content2.body) === null || _activeIframe$content3 === void 0 ? void 0 : _activeIframe$content3.scrollHeight) || 0) + 'px';
            }) : () => null;
            global.addEventListener('resize', throttledResize);

            try {
              var _activeIframe$content4, _activeIframe$content5;

              const elementToFocus = (_activeIframe$content4 = activeIframe.contentWindow) === null || _activeIframe$content4 === void 0 ? void 0 : (_activeIframe$content5 = _activeIframe$content4.document.body) === null || _activeIframe$content5 === void 0 ? void 0 : _activeIframe$content5.querySelector(payload.onOpenNodeToTakeFocus || '');
              /* try to focus on the query selector the customer provided  */

              elementToFocus.focus();
            } catch (e) {
              var _activeIframe$content6, _activeIframe$content7;

              /* otherwise, find the first focusable element and focus on that */
              const firstFocusableElement = (_activeIframe$content6 = activeIframe.contentWindow) === null || _activeIframe$content6 === void 0 ? void 0 : (_activeIframe$content7 = _activeIframe$content6.document.body) === null || _activeIframe$content7 === void 0 ? void 0 : _activeIframe$content7.querySelector('button, a:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"])');

              if (firstFocusableElement) {
                firstFocusableElement.focus();
              }
            }

            const handleEscKeypress = (event, documentEventHandler, iframeEventHandler) => {
              if (event.key === 'Escape') {
                var _activeIframe$content8;

                dismissMessage(activeIframe);
                overlay.remove();
                document.removeEventListener('keydown', documentEventHandler);

                if (activeIframe !== null && activeIframe !== void 0 && (_activeIframe$content8 = activeIframe.contentWindow) !== null && _activeIframe$content8 !== void 0 && _activeIframe$content8.document && !!iframeEventHandler) {
                  var _activeIframe$content9;

                  (_activeIframe$content9 = activeIframe.contentWindow) === null || _activeIframe$content9 === void 0 ? void 0 : _activeIframe$content9.document.removeEventListener('keydown', iframeEventHandler);
                }

                global.removeEventListener('resize', throttledResize);
              }
            };
            /*
              handleDocumentEscPress and handleIFrameEscPress both are separate
              keydown handlers to dismiss the message when the _esc_ key is pressed.
               The reason these are abstracted into their own methods is because the method
              for adding the event handler also removes itself in its own callback. BUT since
              we have 2 event listeners (one for the document, and one for the iframe), the method
              to add the listener needs to know about both of these _addEventListener_ abstracted
              callbacks so the code can properly remove the same listener that was added.
               In other words, it solves for the issue where you're adding an event listener as a lambda
              like so and and you get a unique event listener each time:
               document.addEventListener('keydown', () => // do stuff)
               this example code adds a new event listener each time and never gets cleaned up 
              because there's no reference that to "() => // do stuff" that can be re-used in the
              _removeEventListener_ call.
            */


            const handleDocumentEscPress = event => handleEscKeypress(event, handleDocumentEscPress);

            const handleIFrameEscPress = event => handleEscKeypress(event, handleDocumentEscPress, handleIFrameEscPress);

            document.addEventListener('keydown', handleDocumentEscPress);

            if (activeIframe !== null && activeIframe !== void 0 && (_activeIframe$content10 = activeIframe.contentWindow) !== null && _activeIframe$content10 !== void 0 && _activeIframe$content10.document) {
              var _activeIframe$content11;

              (_activeIframe$content11 = activeIframe.contentWindow) === null || _activeIframe$content11 === void 0 ? void 0 : _activeIframe$content11.document.addEventListener('keydown', handleIFrameEscPress);
            }

            overlay.addEventListener('click', () => {
              var _activeIframe$content12;

              dismissMessage(activeIframe);
              overlay.remove();
              document.removeEventListener('keydown', handleDocumentEscPress);

              if (activeIframe !== null && activeIframe !== void 0 && (_activeIframe$content12 = activeIframe.contentWindow) !== null && _activeIframe$content12 !== void 0 && _activeIframe$content12.document) {
                var _activeIframe$content13;

                (_activeIframe$content13 = activeIframe.contentWindow) === null || _activeIframe$content13 === void 0 ? void 0 : _activeIframe$content13.document.removeEventListener('keydown', handleIFrameEscPress);
              }

              global.removeEventListener('resize', throttledResize);
            });
            /*
              create an absolutely positioned button that lies underneath the
              in-app message and takes up full width and height
               The reason for this is if the customer made their in-app take less width
              than the iframe surrounding it, they should still be able to click outside
              their in-app, but within the bounds of the iframe to dismiss it.
               The overlay doesn't handle this because the overlay only surrounds the iframe,
              not the in-app message. So imagine an in-app looking like this:
            */

            if ((_activeIframe$content14 = activeIframe.contentWindow) !== null && _activeIframe$content14 !== void 0 && _activeIframe$content14.document) {
              const absoluteDismissButton = activeIframe.contentWindow.document.createElement('button');
              absoluteDismissButton.style.cssText = `
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                font: inherit;
                cursor: unset;
                outline: inherit;
                height: 100vh;
                width: 100vw;
                position: fixed;
                top: 0;
                left: 0;
                z-index: -1;
              `;
              /* 
                don't let the user tab to this button. 
                It's not necessarily for blind folks to tab over 
              */

              absoluteDismissButton.tabIndex = -1;
              absoluteDismissButton.addEventListener('click', () => {
                var _activeIframe$content15;

                dismissMessage(activeIframe);
                overlay.remove();
                document.removeEventListener('keydown', handleDocumentEscPress);

                if (activeIframe !== null && activeIframe !== void 0 && (_activeIframe$content15 = activeIframe.contentWindow) !== null && _activeIframe$content15 !== void 0 && _activeIframe$content15.document) {
                  var _activeIframe$content16;

                  (_activeIframe$content16 = activeIframe.contentWindow) === null || _activeIframe$content16 === void 0 ? void 0 : _activeIframe$content16.document.removeEventListener('keydown', handleIFrameEscPress);
                }

                global.removeEventListener('resize', throttledResize);
              });
              activeIframe.contentWindow.document.body.appendChild(absoluteDismissButton);
            }
            /* 
              track in-app consumes only when _saveToInbox_ 
              is falsy or undefined and always track in-app opens
               Also swallow any 400+ response errors. We don't care about them.
            */


            if (_constants.ENABLE_INAPP_CONSUME || _constants.IS_PRODUCTION) {
              Promise.all(!(activeMessage !== null && activeMessage !== void 0 && activeMessage.saveToInbox) ? [(0, _events.trackInAppOpen)({
                messageId: activeMessage.messageId,
                deviceInfo: {
                  appPackageName: payload.packageName
                }
              }), (0, _events.trackInAppConsume)({
                messageId: activeMessage.messageId,
                deviceInfo: {
                  appPackageName: payload.packageName
                }
              })] : [(0, _events.trackInAppOpen)({
                messageId: activeMessage.messageId,
                deviceInfo: {
                  appPackageName: payload.packageName
                }
              })]).catch(e => e);
            }
            /* now we'll add click tracking to _all_ anchor tags */


            const links = ((_activeIframe$content17 = activeIframe.contentWindow) === null || _activeIframe$content17 === void 0 ? void 0 : (_activeIframe$content18 = _activeIframe$content17.document) === null || _activeIframe$content18 === void 0 ? void 0 : _activeIframe$content18.querySelectorAll('a')) || [];

            for (let i = 0; i < links.length; i++) {
              const link = links[i];
              const clickedUrl = link.getAttribute('href') || '';
              const openInNewTab = link.getAttribute('target') === '_blank';
              const isIterableKeywordLink = !!clickedUrl.match(/itbl:\/\/|iterable:\/\/|action:\/\//gim);
              const isDismissNode = !!clickedUrl.match(/(itbl:\/\/|iterable:\/\/)dismiss/gim);

              if (isDismissNode) {
                /* 
                  give the close anchor tag properties that make it 
                  behave more like a button with a logical aria label
                */
                (0, _utils.addButtonAttrsToAnchorTag)(link, 'close modal');
              }

              link.addEventListener('click', event => {
                /* 
                  remove default linking behavior because we're in an iframe 
                  so we need to link the user programatically
                */
                event.preventDefault();

                if (clickedUrl) {
                  /* track the clicked link */
                  (0, _events.trackInAppClick)({
                    clickedUrl,
                    messageId: activeMessage === null || activeMessage === void 0 ? void 0 : activeMessage.messageId,
                    deviceInfo: {
                      appPackageName: dupedPayload.packageName
                    }
                    /* swallow the network error */

                  }).catch(e => e);

                  if (isDismissNode) {
                    var _activeIframe$content19;

                    dismissMessage(activeIframe, clickedUrl);
                    overlay.remove();
                    document.removeEventListener('keydown', handleDocumentEscPress);

                    if (activeIframe !== null && activeIframe !== void 0 && (_activeIframe$content19 = activeIframe.contentWindow) !== null && _activeIframe$content19 !== void 0 && _activeIframe$content19.document) {
                      var _activeIframe$content20;

                      (_activeIframe$content20 = activeIframe.contentWindow) === null || _activeIframe$content20 === void 0 ? void 0 : _activeIframe$content20.document.removeEventListener('keydown', handleIFrameEscPress);
                    }

                    global.removeEventListener('resize', throttledResize);
                  }
                  /*
                    finally (since we're in an iframe), programatically click the link
                    and send the user to where they need to go, only if it's not one
                    of the reserved iterable keyword links
                  */


                  if (!isIterableKeywordLink) {
                    const {
                      handleLinks
                    } = payload;

                    if (typeof handleLinks === 'string') {
                      /* 
                        if the _handleLinks_ option is set, we need to open links 
                        according to that enum. So the way this works is:
                         1. If _open-all-same-tab, then open every link in the same tab
                        2. If _open-all-new-tab, open all in new tab
                        3. If _external-new-tab_, open internal links in same tab, otherwise new tab.
                         This was a fix to account for the fact that Bee editor templates force
                        target="_blank" on all links, so we gave this option as an escape hatch for that.
                      */
                      const clickedHostname = (0, _utils.getHostnameFromUrl)(clickedUrl);
                      /* !clickedHostname means the link was relative with no hostname */

                      const isInternalLink = clickedHostname === global.location.host || !clickedHostname;

                      if (handleLinks === 'open-all-same-tab' || isInternalLink && handleLinks === 'external-new-tab') {
                        global.location.assign(clickedUrl);
                      } else {
                        global.open(clickedUrl, '_blank', 'noopener,noreferrer');
                      }
                    } else if (openInNewTab) {
                      /**
                        Using target="_blank" without rel="noreferrer" and rel="noopener"
                        makes the website vulnerable to window.opener API exploitation attacks
                         @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
                      */
                      global.open(clickedUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      /* otherwise just link them in the same tab */
                      global.location.assign(clickedUrl);
                    }
                  }
                }
              });
            }

            return activeIframe;
          });
        }

        return Promise.resolve('');
      };

      return {
        request: () => (0, _request.baseIterableRequest)({
          method: 'GET',
          url: '/inApp/getMessages',
          validation: {
            params: _inapp.default
          },
          params: _objectSpread(_objectSpread({}, dupedPayload), {}, {
            platform: _constants.WEB_PLATFORM,
            SDKVersion: _constants.SDK_VERSION
          })
        }).then(response => {
          (0, _utils.trackMessagesDelivered)(response.data.inAppMessages || [], dupedPayload.packageName);
          return response;
        }).then(response => {
          /* 
            if the user passed the flag to automatically paint the in-app messages
            to the DOM, start a timer and show each in-app message upon close + timer countdown
            
            However there are 3 conditions in which to not show a message:
            
            1. _read_ key is truthy
            2. _trigger.type_ key is "never"
            3. HTML body is blank
             so first filter out unwanted messages and sort them
          */
          parsedMessages = (0, _utils.sortInAppMessages)((0, _utils.filterHiddenInAppMessages)(response.data.inAppMessages));
          return paintMessageToDOM().then(() => {
            return _objectSpread(_objectSpread({}, response), {}, {
              data: {
                inAppMessages: parsedMessages
              }
            });
          });
        }),
        pauseMessageStream: () => {
          if (timer) {
            clearTimeout(timer);
          }
        },
        resumeMessageStream: () => {
          return paintMessageToDOM();
        }
      };
    }
    /* 
      user doesn't want us to paint messages automatically.
      just return the promise like normal
    */


    return (0, _request.baseIterableRequest)({
      method: 'GET',
      url: '/inApp/getMessages',
      validation: {
        params: _inapp.default
      },
      params: _objectSpread(_objectSpread({}, dupedPayload), {}, {
        platform: _constants.WEB_PLATFORM,
        SDKVersion: _constants.SDK_VERSION
      })
    }).then(response => {
      (0, _utils.trackMessagesDelivered)(response.data.inAppMessages || [], dupedPayload.packageName);
      return response;
    });
  }
});