import { by } from '@pabra/sortby';
import { InAppMessage } from './types';
import { srSpeak } from 'src/utils/srSpeak';
import { trackInAppDelivery } from '../events';
import { WebInAppDisplaySettings } from 'src/inapp';
import { ANIMATION_DURATION } from 'src/constants';

export const addStyleSheet = (doc: Document, style: string) => {
  const stylesheet = doc.createElement('style');
  stylesheet.textContent = style;
  doc.head.appendChild(stylesheet);
};

export const preloadImages = (imageLinks: string[], callback: () => void) => {
  if (!imageLinks?.length) {
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
        return (loadedImages += 1);
      }

      return callback();
    };

    /* do the same for onerror - if the images fail, we still need to show the message */
    images[i].onerror = () => {
      if (loadedImages + 1 !== imageLinks.length) {
        return (loadedImages += 1);
      }

      return callback();
    };
  }
};

export const filterHiddenInAppMessages = (
  messages: Partial<InAppMessage>[] = []
) => {
  return messages.filter((eachMessage) => {
    return (
      !eachMessage.read &&
      eachMessage.trigger?.type !== 'never' &&
      !!eachMessage.content?.html
    );
  });
};

export const sortInAppMessages = (messages: Partial<InAppMessage>[] = []) => {
  return messages.sort(by(['priorityLevel', 'asc'], ['createdAt', 'asc']));
};

export const generateLayoutCSS = (
  baseCSSText: string,
  position: WebInAppDisplaySettings['position'],
  isMobileBreakpoint: boolean,
  topOffset?: string,
  bottomOffset?: string,
  rightOffset?: string
) => {
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

const mediaQueryMd = global.matchMedia('(min-width: 850px)');
const mediaQueryLg = global.matchMedia('(max-width: 1200px)');

/**
 *
 * @param html html you want to paint to the DOM inside the iframe
 * @param callback method to run after HTML has been written to iframe
 * @param srMessage The message you want the screen reader to read when popping up the message
 * @returns { HTMLIFrameElement }
 */
export const paintIFrame = (
  html: string,
  position: WebInAppDisplaySettings['position'],
  shouldAnimate?: boolean,
  srMessage?: string,
  topOffset?: string,
  bottomOffset?: string,
  rightOffset?: string
): Promise<HTMLIFrameElement> =>
  new Promise((resolve: (value: HTMLIFrameElement) => void) => {
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
    const images =
      html?.match(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/gim) || [];
    return preloadImages(images, () => {
      /* 
       set the scroll height to the content inside, but since images
       are going to take some time to load, we opt to preload them, THEN
       set the inner HTML of the iframe
       */
      document.body.appendChild(iframe);
      iframe.contentWindow?.document?.open();
      iframe.contentWindow?.document?.write(html);
      iframe.contentWindow?.document?.close();

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
        const setCSS = (width: string) => {
          iframe.style.cssText = generateLayoutCSS(
            shouldAnimate &&
              (position === 'TopRight' || position === 'BottomRight')
              ? `
              position: fixed;
              border: none;
              margin: auto;
              max-width: 100%;
              z-index: 9999;
              transform: translateX(150%);
              -webkit-transform: translateX(150%);
              width: ${width};
              height: ${iframe.style.height};
            `
              : `
              position: fixed;
              border: none;
              margin: auto;
              max-width: 100%;
              z-index: 9999;
              width: ${width};
              height: ${iframe.style.height};
            `,
            position,
            !mediaQueryMd.matches,
            topOffset,
            bottomOffset,
            rightOffset
          );
        };

        const startingWidth =
          position === 'Full' ? 100 : position === 'Center' ? 50 : 33;
        setCSS(`${startingWidth}%`);

        if (shouldAnimate) {
          iframe.className =
            position === 'Center' || position === 'Full'
              ? 'fade-in'
              : 'slide-in';
        }

        /* 
          breakpoint widths are as follows:
          
          1. TopRight, BottomRight (100% at < 850px, 33% < 1200px, 25% > 1200px)
          2. Center (50% > 850px, 100% < 850px)
          3. Full (100% all the time)
        */
        if (!mediaQueryMd.matches) {
          if (position === 'TopRight' || position === 'BottomRight') {
            /* 
              in-app messages is being initially painted, but we're on mobile
              breakpoints so remove any offsets the user provided in the config object.
            */
            setCSS('100%');
          } else {
            iframe.style.width = '100%';
          }
        }

        if (
          !mediaQueryLg.matches &&
          (position === 'TopRight' || position === 'BottomRight')
        ) {
          iframe.style.width = '25%';
        }

        mediaQueryMd.onchange = (event) => {
          if (!event.matches || position === 'Full') {
            if (position === 'TopRight' || position === 'BottomRight') {
              /* 
                here we hit a mobile breakpoint for TopRight or BottomRight.
                We re-generate the entire CSS because we want to remove any custom
                offsets the user gave us for these since mobile should not allow for margins
                in the iframe since screen real-estate is precious.
              */
              setCSS(`100%`);
            } else {
              iframe.style.width = '100%';
            }
          } else {
            if (position === 'TopRight' || position === 'BottomRight') {
              /* 
                same comment as above but we want to apply the offsets again 
                since we're back to desktop-sized breakpoints
              */
              setCSS(`${startingWidth}%`);
            } else {
              iframe.style.width = `${startingWidth}%`;
            }
          }
        };

        mediaQueryLg.onchange = (event) => {
          if (
            !event.matches &&
            (position === 'TopRight' || position === 'BottomRight')
          ) {
            iframe.style.width = '25%';
          }

          if (
            event.matches &&
            (position === 'TopRight' || position === 'BottomRight')
          ) {
            iframe.style.width = '33%';
          }
        };

        if (position !== 'Full') {
          iframe.style.height =
            (iframe.contentWindow?.document?.body?.scrollHeight || 0) + 'px';
        }

        clearTimeout(timeout);
      }, 100);
      resolve(iframe);
    });
  }).then((iframe: HTMLIFrameElement) => {
    if (srMessage) {
      srSpeak(srMessage, 'assertive');
    }
    return iframe;
  });
export const addButtonAttrsToAnchorTag = (node: Element, ariaLabel: string) => {
  node.setAttribute('aria-label', ariaLabel);
  node.setAttribute('role', 'button');
  node.setAttribute('href', 'javascript:undefined');
};

export const trackMessagesDelivered = (
  messages: Partial<InAppMessage>[] = [],
  packageName: string
) => {
  return Promise.all(
    messages?.map((eachMessage) => {
      return trackInAppDelivery({
        messageId: eachMessage.messageId as string,
        deviceInfo: {
          appPackageName: packageName
        }
        /* 
          swallow any network failures. 
          If it fails, there's nothing really we can do here. 
        */
      });
    })
  ).catch((e) => e);
};

export const paintOverlay = (
  color = '#fff',
  opacity = 0,
  shouldAnimate = false
) => {
  const overlay = document.createElement('div');
  overlay.setAttribute('data-test-overlay', 'true');
  if (shouldAnimate) {
    addStyleSheet(
      document,
      `
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
    `
    );
  }

  overlay.style.cssText = shouldAnimate
    ? `
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: ${color};
    opacity: ${opacity};
    top: 0;
    left: 0;
    z-index: 9998;
    -webkit-animation: fadeinfast ${ANIMATION_DURATION / 2}ms;
    -moz-animation: fadeinfast ${ANIMATION_DURATION / 2}ms;
    -ms-animation: fadeinfast ${ANIMATION_DURATION / 2}ms;
    -o-animation: fadeinfast ${ANIMATION_DURATION / 2}ms;
    animation: fadeinfast ${ANIMATION_DURATION / 2}ms;
  `
    : `
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
