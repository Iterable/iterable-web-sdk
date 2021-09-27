import { by } from '@pabra/sortby';
import { InAppMessage } from './types';
import { srSpeak } from 'src/utils/srSpeak';
import { trackInAppDelivery } from '../events';

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

/**
 *
 * @param html html you want to paint to the DOM inside the iframe
 * @param callback method to run after HTML has been written to iframe
 * @param srMessage The message you want the screen reader to read when popping up the message
 * @returns { HTMLIFrameElement }
 */
export const paintIFrame = (
  html: string,
  top?: number | null,
  bottom?: number | null,
  right?: number | null,
  left?: number | null,
  srMessage?: string
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
        iframe.style.cssText = `
            position: fixed;
            border: none;
            margin: auto;
            width: 50%;
            max-width: 100%;
            z-index: 9999;
         `;

        const mediaQuery = global.matchMedia('(min-width: 850px)');
        if (!mediaQuery.matches) {
          iframe.style.width = '100%';
        }

        mediaQuery.onchange = (event) => {
          if (!event.matches) {
            iframe.style.width = '100%';
          } else {
            iframe.style.width = '50%';
          }
        };

        if (typeof top === 'number') iframe.style.top = `${top}%`;
        if (typeof bottom === 'number') iframe.style.bottom = `${bottom}%`;
        if (typeof left === 'number') iframe.style.left = `${left}%`;
        if (typeof right === 'number') iframe.style.right = `${right}%`;

        iframe.style.height =
          (iframe.contentWindow?.document?.body?.scrollHeight || 0) + 1 + 'px';

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

export const paintOverlay = (color = '#fff', opacity = 0) => {
  const overlay = document.createElement('div');
  overlay.setAttribute('data-test-overlay', 'true');
  overlay.style.cssText = `
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

export const generatePositions = (
  initTop?: number,
  initBottom?: number,
  initRight?: number,
  initLeft?: number
) => {
  let top = initTop;
  let bottom = initBottom;
  let right = initRight;
  let left = initLeft;
  if (typeof initTop !== 'number' && typeof initBottom !== 'number') {
    bottom = 0;
    top = 0;
  }

  if (typeof initRight !== 'number' && typeof initLeft !== 'number') {
    left = 0;
    right = 0;
  }

  return {
    top,
    bottom,
    right,
    left
  };
};
