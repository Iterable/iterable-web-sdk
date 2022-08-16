import { by } from '@pabra/sortby';
import { InAppMessage } from './types';
import { srSpeak } from 'src/utils/srSpeak';
import { trackInAppDelivery } from '../events';
import { WebInAppDisplaySettings } from 'src/inapp';
import { ANIMATION_DURATION } from 'src/constants';

interface Breakpoints {
  smMatches: boolean;
  mdMatches: boolean;
  lgMatches: boolean;
  xlMatches: boolean;
}

export const generateWidth = (
  { smMatches, mdMatches, lgMatches, xlMatches }: Breakpoints,
  position: WebInAppDisplaySettings['position']
): string => {
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

export const generateCloseButton = (
  doc: Document,
  position?: 'top-right' | 'top-left',
  color?: string,
  size?: string | number,
  iconPath?: string,
  topOffset?: string,
  sideOffset?: string
) => {
  const parsedSize = typeof size === 'number' ? `${size}px` : size || '24px';
  const sharedStyles = `
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    overflow: visible;
    background: transparent;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
    position: absolute;
    top: ${topOffset || '4%'};
    width: ${parsedSize};
    height: ${parsedSize};
    font-size: ${parsedSize};
    color: ${color};
  `;
  const button = doc.createElement('button');
  button.style.cssText =
    position === 'top-left'
      ? `
    ${sharedStyles}
    left: ${sideOffset || '4%'};
  `
      : `
    ${sharedStyles}
    right: ${sideOffset || '4%'};
  `;

  if (iconPath) {
    button.style.backgroundImage = `url(${iconPath})`;
    button.style.backgroundSize = 'cover';
  } else {
    /* HTMl encoded "X" icon */
    button.innerHTML = '&#x2715';
  }

  /* 
    no idea why typescript is saying "ariaLabel" doesn't exist on type HTMLButtonElement.
    Most likely going to need to upgrade typescript to fix this, but in the meantime, we ignore it.
  */
  /* @ts-ignore-next-line */
  button.ariaLabel = 'Close modal button';
  button.setAttribute('data-qa-custom-close-button', 'true');
  return button;
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
      max-height: ${isMobileBreakpoint ? '85vh' : '95vh'};
    `;
  }

  if (position === 'TopRight') {
    styles = `
      right: ${isMobileBreakpoint ? '0%' : rightOffset || '0%'};
      top: ${isMobileBreakpoint ? '0%' : topOffset || '0%'};
      max-height: ${isMobileBreakpoint ? '85vh' : '95vh'};
    `;
  }

  if (position === 'BottomRight') {
    styles = `
      right: ${isMobileBreakpoint ? '0%' : rightOffset || '0%'};
      bottom: ${isMobileBreakpoint ? '0%' : bottomOffset || '0%'};
      max-height: ${isMobileBreakpoint ? '85vh' : '95vh'};
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

const mediaQuerySm = global?.matchMedia?.('(max-width: 850px)');
const mediaQueryMd = global?.matchMedia?.(
  '(min-width: 851px) and (max-width: 975px)'
);
const mediaQueryLg = global?.matchMedia?.(
  '(min-width: 976px) and (max-width: 1300px)'
);
const mediaQueryXl = global?.matchMedia?.('(min-width: 1301px)');

/**
 *
 * @returns { HTMLIFrameElement } iframe with sandbox and hidden styling applied for of an inapp message to render with
 */
const generateSecuredIFrame = () => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'iterable-iframe');
  iframe.setAttribute('sandbox', 'allow-same-origin allow-popups');
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
  `;

  return iframe;
};

/**
 *
 * @param html
 * @returns { string } html string of an inapp message to wrap in an iframe for render
 */
export const wrapWithIFrame = (html: string): string => {
  const iframe = generateSecuredIFrame();
  return iframe.outerHTML.replace(
    '<iframe',
    `<iframe onload='((f) => {const doc = "${html
      .replaceAll(/\r?\n|\r/g, '')
      .replaceAll('"', '\\"')}";f.contentWindow.document.write(doc);})(this)'`
  );
};

/**
 *
 * @param html html you want to paint to the DOM inside the iframe
 * @param position screen position the message should appear in
 * @param shouldAnimate if the in-app should animate in/out
 * @param srMessage The message you want the screen reader to read when popping up the message
 * @param topOffset how many px or % buffer between the in-app message and the top of the screen
 * @param bottomOffset how many px or % buffer between the in-app message and the bottom of the screen
 * @param rightOffset how many px or % buffer between the in-app message and the right of the screen
 *
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
    const iframe = generateSecuredIFrame();

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
            mediaQuerySm.matches,
            topOffset,
            bottomOffset,
            rightOffset
          );
        };

        if (shouldAnimate) {
          iframe.className =
            position === 'Center' || position === 'Full'
              ? 'fade-in'
              : 'slide-in';
        }

        const initialWidth = generateWidth(
          {
            smMatches: mediaQuerySm.matches,
            mdMatches: mediaQueryMd.matches,
            lgMatches: mediaQueryLg.matches,
            xlMatches: mediaQueryXl.matches
          },
          position
        );

        /* set the initial width based at the breakpoint we loaded the message at. */
        setCSS(position === 'Full' ? '100%' : initialWidth);

        const setNewWidth = () => {
          setCSS(
            generateWidth(
              {
                smMatches: mediaQuerySm.matches,
                mdMatches: mediaQueryMd.matches,
                lgMatches: mediaQueryLg.matches,
                xlMatches: mediaQueryXl.matches
              },
              position
            )
          );
        };

        mediaQuerySm.onchange = () => {
          if (position !== 'Full') {
            setNewWidth();
          }
        };
        mediaQueryMd.onchange = () => {
          if (position !== 'Full') {
            setNewWidth();
          }
        };
        mediaQueryLg.onchange = () => {
          if (position !== 'Full') {
            setNewWidth();
          }
        };
        mediaQueryXl.onchange = () => {
          if (position !== 'Full') {
            setNewWidth();
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
  node.setAttribute('data-qa-original-link', node.getAttribute('href') || '');
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

export const getHostnameFromUrl = (url: string): string | undefined => {
  const linkHost = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  return linkHost?.[1];
};
