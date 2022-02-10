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
  _exports.trackMessagesDelivered = _exports.sortInAppMessages = _exports.preloadImages = _exports.paintOverlay = _exports.paintIFrame = _exports.getHostnameFromUrl = _exports.generateWidth = _exports.generateLayoutCSS = _exports.filterHiddenInAppMessages = _exports.addStyleSheet = _exports.addButtonAttrsToAnchorTag = void 0;

  var _global, _global$matchMedia, _global2, _global2$matchMedia, _global3, _global3$matchMedia, _global4, _global4$matchMedia;

  const generateWidth = ({
    smMatches,
    mdMatches,
    lgMatches,
    xlMatches
  }, position) => {
    /* 
      breakpoint widths are as follows:
      
      1. TopRight, BottomRight (100% at SM; 45% at MD; 33% at LG; 25% at XL)
      2. Center (100% at SM, MD; 50% at LG, XL)
      3. Full (100% all the time)
    */
    if (smMatches) {
      return '100%';
    }

    if (mdMatches) {
      if (position === 'TopRight' || position === 'BottomRight') {
        /* 
          in-app messages is being initially painted, but we're on mobile
          breakpoints so remove any offsets the user provided in the config object.
        */
        return '45%';
      }

      return '50%';
    }

    if (lgMatches) {
      if (position === 'TopRight' || position === 'BottomRight') {
        return '33%';
      }

      return '50%';
    }

    if (xlMatches) {
      if (position === 'TopRight' || position === 'BottomRight') {
        return '25%';
      }

      return '50%';
    }
    /* 
      this line will never run. One of those breakpoints has to return true 
      but this is just to appease typescript.
    */


    return '100%';
  };

  _exports.generateWidth = generateWidth;

  const addStyleSheet = (doc, style) => {
    const stylesheet = doc.createElement('style');
    stylesheet.textContent = style;
    doc.head.appendChild(stylesheet);
  };

  _exports.addStyleSheet = addStyleSheet;

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

  const generateLayoutCSS = (baseCSSText, position, isMobileBreakpoint, topOffset, bottomOffset, rightOffset) => {
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
      right: ${isMobileBreakpoint ? '0%' : rightOffset || '0%'};
      top: ${isMobileBreakpoint ? '0%' : topOffset || '0%'};
    `;
    }

    if (position === 'BottomRight') {
      styles = `
      right: ${isMobileBreakpoint ? '0%' : rightOffset || '0%'};
      bottom: ${isMobileBreakpoint ? '0%' : bottomOffset || '0%'};
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

  _exports.generateLayoutCSS = generateLayoutCSS;
  const mediaQuerySm = (_global = global) === null || _global === void 0 ? void 0 : (_global$matchMedia = _global.matchMedia) === null || _global$matchMedia === void 0 ? void 0 : _global$matchMedia.call(_global, '(max-width: 850px)');
  const mediaQueryMd = (_global2 = global) === null || _global2 === void 0 ? void 0 : (_global2$matchMedia = _global2.matchMedia) === null || _global2$matchMedia === void 0 ? void 0 : _global2$matchMedia.call(_global2, '(min-width: 851px) and (max-width: 975px)');
  const mediaQueryLg = (_global3 = global) === null || _global3 === void 0 ? void 0 : (_global3$matchMedia = _global3.matchMedia) === null || _global3$matchMedia === void 0 ? void 0 : _global3$matchMedia.call(_global3, '(min-width: 976px) and (max-width: 1300px)');
  const mediaQueryXl = (_global4 = global) === null || _global4 === void 0 ? void 0 : (_global4$matchMedia = _global4.matchMedia) === null || _global4$matchMedia === void 0 ? void 0 : _global4$matchMedia.call(_global4, '(min-width: 1301px)');
  /**
   *
   * @param html html you want to paint to the DOM inside the iframe
   * @param callback method to run after HTML has been written to iframe
   * @param srMessage The message you want the screen reader to read when popping up the message
   * @returns { HTMLIFrameElement }
   */

  const paintIFrame = (html, position, shouldAnimate, srMessage, topOffset, bottomOffset, rightOffset) => new Promise(resolve => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iterable-iframe');
    /* 
      _display: none_ would remove the ability to set event handlers on elements
      so instead we choose to hide it visibly with CSS but not actually remove
      its interact-ability
      
      https://snook.ca/archives/html_and_css/hiding-content-for-accessibility 
    */

    iframe.style.cssText = `
      position: fixed !important;
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
        const setCSS = width => {
          iframe.style.cssText = generateLayoutCSS(shouldAnimate && (position === 'TopRight' || position === 'BottomRight') ? `
              position: fixed;
              border: none;
              margin: auto;
              max-width: 100%;
              z-index: 9999;
              transform: translateX(150%);
              -webkit-transform: translateX(150%);
              width: ${width};
              height: ${iframe.style.height};
            ` : `
              position: fixed;
              border: none;
              margin: auto;
              max-width: 100%;
              z-index: 9999;
              width: ${width};
              height: ${iframe.style.height};
            `, position, mediaQuerySm.matches, topOffset, bottomOffset, rightOffset);
        };

        if (shouldAnimate) {
          iframe.className = position === 'Center' || position === 'Full' ? 'fade-in' : 'slide-in';
        }

        const initialWidth = generateWidth({
          smMatches: mediaQuerySm.matches,
          mdMatches: mediaQueryMd.matches,
          lgMatches: mediaQueryLg.matches,
          xlMatches: mediaQueryXl.matches
        }, position);
        /* set the initial width based at the breakpoint we loaded the message at. */

        setCSS(position === 'Full' ? '100%' : initialWidth);

        const setNewWidth = event => {
          setCSS(generateWidth({
            smMatches: mediaQuerySm.matches,
            mdMatches: mediaQueryMd.matches,
            lgMatches: mediaQueryLg.matches,
            xlMatches: mediaQueryXl.matches
          }, position));
        };

        mediaQuerySm.onchange = event => {
          if (position !== 'Full') {
            setNewWidth(event);
          }
        };

        mediaQueryMd.onchange = event => {
          if (position !== 'Full') {
            setNewWidth(event);
          }
        };

        mediaQueryLg.onchange = event => {
          if (position !== 'Full') {
            setNewWidth(event);
          }
        };

        mediaQueryXl.onchange = event => {
          if (position !== 'Full') {
            setNewWidth(event);
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
      addStyleSheet(document, `
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

  const getHostnameFromUrl = url => {
    const linkHost = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    return linkHost === null || linkHost === void 0 ? void 0 : linkHost[1];
  };

  _exports.getHostnameFromUrl = getHostnameFromUrl;
});