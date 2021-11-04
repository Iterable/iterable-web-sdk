(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@pabra/sortby", "../utils/srSpeak", "../events", "../constants"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@pabra/sortby"), require("../utils/srSpeak"), require("../events"), require("../constants"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.sortby, global.srSpeak, global.events, global.constants);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _sortby, _srSpeak, _events, _constants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.paintOverlay = _exports.trackMessagesDelivered = _exports.addButtonAttrsToAnchorTag = _exports.paintIFrame = _exports.generateLayoutCSS = _exports.sortInAppMessages = _exports.filterHiddenInAppMessages = _exports.preloadImages = _exports.addStyleSheeet = void 0;

  const addStyleSheeet = (doc, style) => {
    const stylesheet = doc.createElement('style');
    stylesheet.textContent = style;
    doc.head.appendChild(stylesheet);
  };

  _exports.addStyleSheeet = addStyleSheeet;

  const preloadImages = (imageLinks, callback) => {
    if (!(imageLinks !== null && imageLinks !== void 0 && imageLinks.length)) {
      callback();
    }

    const images = [];
    let loadedImages = 0;

    for (let i = 0; i < imageLinks.length; i++) {
      images[i] = new Image();
      images[i].src = imageLinks[i];

      images[i].onload = () => {
        /* 
          track the amount of images we preloaded. If this is the last image
          that's been preloaded, it's time to invoke the callback function we passed.
        */
        if (loadedImages + 1 !== imageLinks.length) {
          return loadedImages += 1;
        }

        return callback();
      };
      /* do the same for onerror - if the images fail, we still need to show the message */


      images[i].onerror = () => {
        if (loadedImages + 1 !== imageLinks.length) {
          return loadedImages += 1;
        }

        return callback();
      };
    }
  };

  _exports.preloadImages = preloadImages;

  const filterHiddenInAppMessages = (messages = []) => {
    return messages.filter(eachMessage => {
      var _eachMessage$trigger, _eachMessage$content;

      return !eachMessage.read && ((_eachMessage$trigger = eachMessage.trigger) === null || _eachMessage$trigger === void 0 ? void 0 : _eachMessage$trigger.type) !== 'never' && !!((_eachMessage$content = eachMessage.content) !== null && _eachMessage$content !== void 0 && _eachMessage$content.html);
    });
  };

  _exports.filterHiddenInAppMessages = filterHiddenInAppMessages;

  const sortInAppMessages = (messages = []) => {
    return messages.sort((0, _sortby.by)(['priorityLevel', 'asc'], ['createdAt', 'asc']));
  };

  _exports.sortInAppMessages = sortInAppMessages;

  const generateLayoutCSS = (baseCSSText, position) => {
    let styles = '';

    if (position === 'Center') {
      styles = `
      left: 0%;
      right: 0%;
      top: 0%;
      bottom: 0%;
    `;
    }

    if (position === 'TopRight') {
      styles = `
      right: 0%;
      top: 0%;
    `;
    }

    if (position === 'BottomRight') {
      styles = `
      right: 0%;
      bottom: 0%;
    `;
    }

    if (position === 'Full') {
      styles = `
      height: 100%;
      width: 100%;
      left: 0%;
      top: 0%;
    `;
    }

    return `
    ${baseCSSText}
    ${styles}
  `;
  };
  /**
   *
   * @param html html you want to paint to the DOM inside the iframe
   * @param callback method to run after HTML has been written to iframe
   * @param srMessage The message you want the screen reader to read when popping up the message
   * @returns { HTMLIFrameElement }
   */


  _exports.generateLayoutCSS = generateLayoutCSS;

  const paintIFrame = (html, position, shouldAnimate, srMessage) => new Promise(resolve => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iterable-iframe');
    /* 
      _display: none_ would remove the ability to set event handlers on elements
      so instead we choose to hide it visibly with CSS but not actually remove
      its interact-ability
      
      https://snook.ca/archives/html_and_css/hiding-content-for-accessibility 
    */

    iframe.style.cssText = `
      position: absolute !important;
      top: 0;
      left: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      clip: rect(1px 1px 1px 1px);
      clip: rect(1px, 1px, 1px, 1px);
    `;
    /* 
      find all the images in the in-app message, preload them, and 
      only then set the height because we need to know how tall the images
      are before we set the height of the iframe.
      
      This prevents a race condition where if we set the height before the images
      are loaded, we might end up with a scrolling iframe
    */

    const images = (html === null || html === void 0 ? void 0 : html.match(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/gim)) || [];
    return preloadImages(images, () => {
      var _iframe$contentWindow, _iframe$contentWindow2, _iframe$contentWindow3, _iframe$contentWindow4, _iframe$contentWindow5, _iframe$contentWindow6;

      /* 
        set the scroll height to the content inside, but since images
        are going to take some time to load, we opt to preload them, THEN
        set the inner HTML of the iframe
      */
      document.body.appendChild(iframe);
      (_iframe$contentWindow = iframe.contentWindow) === null || _iframe$contentWindow === void 0 ? void 0 : (_iframe$contentWindow2 = _iframe$contentWindow.document) === null || _iframe$contentWindow2 === void 0 ? void 0 : _iframe$contentWindow2.open();
      (_iframe$contentWindow3 = iframe.contentWindow) === null || _iframe$contentWindow3 === void 0 ? void 0 : (_iframe$contentWindow4 = _iframe$contentWindow3.document) === null || _iframe$contentWindow4 === void 0 ? void 0 : _iframe$contentWindow4.write(html);
      (_iframe$contentWindow5 = iframe.contentWindow) === null || _iframe$contentWindow5 === void 0 ? void 0 : (_iframe$contentWindow6 = _iframe$contentWindow5.document) === null || _iframe$contentWindow6 === void 0 ? void 0 : _iframe$contentWindow6.close();
      const timeout = setTimeout(() => {
        /**
          even though we preloaded the images before setting the height, we add an extra 100MS 
          here to handle for the case where the user needs to download custom fonts. As 
          of 07/27/2021, the preloading fonts API is still in a draft state
            
          @see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API
          
          but even if we did preload the fonts, it would still take a non-trivial amount
          of computational time to apply the font to the text, so this setTimeout is acting more
          as a failsafe just incase the new font causes the line-height to grow and create a
          scrollbar in the iframe.
        */
        const startingWidth = position === 'Full' ? 100 : position === 'Center' ? 50 : 33;
        iframe.style.cssText = generateLayoutCSS(shouldAnimate && (position === 'TopRight' || position === 'BottomRight') ? `
            position: fixed;
            border: none;
            margin: auto;
            width: ${startingWidth}%;
            max-width: 100%;
            z-index: 9999;
            transform: translateX(150%);
            -webkit-transform: translateX(150%);      
          ` : `
            position: fixed;
            border: none;
            margin: auto;
            width: ${startingWidth}%;
            max-width: 100%;
            z-index: 9999;
          `, position);

        if (shouldAnimate) {
          iframe.className = position === 'Center' || position === 'Full' ? 'fade-in' : 'slide-in';
        }

        const mediaQueryMd = global.matchMedia('(min-width: 850px)');
        const mediaQueryLg = global.matchMedia('(max-width: 1200px)');
        /* 
          breakpoint widths are as follows:
          
          1. TopRight, BottomRight (100% at < 850px, 33% < 1200px, 25% > 1200px)
          2. Center (50% > 850px, 100% < 850px)
          3. Full (100% all the time)
        */

        if (!mediaQueryMd.matches) {
          iframe.style.width = '100%';
        }

        if (!mediaQueryLg.matches && (position === 'TopRight' || position === 'BottomRight')) {
          iframe.style.width = '25%';
        }

        mediaQueryMd.onchange = event => {
          if (!event.matches || position === 'Full') {
            iframe.style.width = '100%';
          } else {
            iframe.style.width = `${startingWidth}%`;
          }
        };

        mediaQueryLg.onchange = event => {
          if (!event.matches && (position === 'TopRight' || position === 'BottomRight')) {
            iframe.style.width = '25%';
          }

          if (event.matches && (position === 'TopRight' || position === 'BottomRight')) {
            iframe.style.width = '33%';
          }
        };

        if (position !== 'Full') {
          var _iframe$contentWindow7, _iframe$contentWindow8, _iframe$contentWindow9;

          iframe.style.height = (((_iframe$contentWindow7 = iframe.contentWindow) === null || _iframe$contentWindow7 === void 0 ? void 0 : (_iframe$contentWindow8 = _iframe$contentWindow7.document) === null || _iframe$contentWindow8 === void 0 ? void 0 : (_iframe$contentWindow9 = _iframe$contentWindow8.body) === null || _iframe$contentWindow9 === void 0 ? void 0 : _iframe$contentWindow9.scrollHeight) || 0) + 'px';
        }

        clearTimeout(timeout);
      }, 100);
      resolve(iframe);
    });
  }).then(iframe => {
    if (srMessage) {
      (0, _srSpeak.srSpeak)(srMessage, 'assertive');
    }

    return iframe;
  });

  _exports.paintIFrame = paintIFrame;

  const addButtonAttrsToAnchorTag = (node, ariaLabel) => {
    node.setAttribute('aria-label', ariaLabel);
    node.setAttribute('role', 'button');
    node.setAttribute('href', 'javascript:undefined');
  };

  _exports.addButtonAttrsToAnchorTag = addButtonAttrsToAnchorTag;

  const trackMessagesDelivered = (messages = [], packageName) => {
    return Promise.all(messages === null || messages === void 0 ? void 0 : messages.map(eachMessage => {
      return (0, _events.trackInAppDelivery)({
        messageId: eachMessage.messageId,
        deviceInfo: {
          appPackageName: packageName
        }
        /* 
          swallow any network failures. 
          If it fails, there's nothing really we can do here. 
        */

      });
    })).catch(e => e);
  };

  _exports.trackMessagesDelivered = trackMessagesDelivered;

  const paintOverlay = (color = '#fff', opacity = 0, shouldAnimate = false) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('data-test-overlay', 'true');

    if (shouldAnimate) {
      addStyleSheeet(document, `
        @keyframes fadeinfast {
          from { opacity: 0; }
          to { opacity: ${opacity}; }
        }
      
        @-moz-keyframes fadeinfast {
          from { opacity: 0; }
          to { opacity: ${opacity}; }
        }
      
        @-webkit-keyframes fadeinfast {
          from { opacity: 0; }
          to { opacity: ${opacity}; }
        }
      
        @-ms-keyframes fadeinfast {
          from { opacity: 0; }
          to { opacity: ${opacity}; }
        }    
    `);
    }

    overlay.style.cssText = shouldAnimate ? `
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: ${color};
    opacity: ${opacity};
    top: 0;
    left: 0;
    z-index: 9998;
    -webkit-animation: fadeinfast ${_constants.ANIMATION_DURATION / 2}ms;
    -moz-animation: fadeinfast ${_constants.ANIMATION_DURATION / 2}ms;
    -ms-animation: fadeinfast ${_constants.ANIMATION_DURATION / 2}ms;
    -o-animation: fadeinfast ${_constants.ANIMATION_DURATION / 2}ms;
    animation: fadeinfast ${_constants.ANIMATION_DURATION / 2}ms;
  ` : `
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: ${color};
    opacity: ${opacity};
    top: 0;
    left: 0;
    z-index: 9998;
  `;
    document.body.appendChild(overlay);
    return overlay;
  };

  _exports.paintOverlay = paintOverlay;
});