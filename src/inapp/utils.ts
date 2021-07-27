import { by } from '@pabra/sortby';
import { InAppMessage } from './types';
import srSpeak from 'src/utils/srSpeak';
import { trackInAppDelivery } from '../events';

const preloadImages = (imageLinks: string[], callback: () => void) => {
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
  callback: (frame: HTMLIFrameElement) => void,
  position: 'full' | 'top-right' | 'bottom-right' | 'center',
  srMessage?: string
) => {
  const iframe = document.createElement('iframe');

  /* 
    find all the images in the in-app message, preload them, and 
    only then set the height because we need to know how tall the images
    are before we set the height of the iframe.
    
    This prevents a race condition where if we set the height before the images
    are loaded, we might end up with a scrolling iframe
  */
  const images =
    html?.match(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/gim) || [];
  preloadImages(images, () => {
    /* 
      set the scroll height to the content inside, but since images
      are going to take some time to load, we opt to preload them, THEN
      set the inner HTML of the iframe
    */
    document.body.appendChild(iframe);
    iframe.contentWindow?.document?.open();
    iframe.contentWindow?.document?.write(html);
    iframe.contentWindow?.document?.close();

    callback(iframe);

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
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9999;
    `;

      if (position === 'top-right') {
        iframe.style.bottom = 'unset';
        iframe.style.left = 'unset';
        iframe.style.margin = 'unset';

        const mediaQuery = window.matchMedia('(min-width: 850px)');
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
      }

      if (position === 'bottom-right') {
        iframe.style.top = 'unset';
        iframe.style.left = 'unset';
        iframe.style.margin = 'unset';

        const mediaQuery = window.matchMedia('(min-width: 850px)');
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
      }

      if (position === 'full') {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
      }

      if (position === 'center') {
        const mediaQuery = window.matchMedia('(min-width: 850px)');
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
      }

      iframe.height = iframe.contentWindow?.document.body.scrollHeight + 'px';

      clearTimeout(timeout);
    }, 100);
  });
  if (srMessage) {
    srSpeak(srMessage, 'assertive');
  }
  return iframe;
};

export const addButtonAttrsToAnchorTag = (node: Element, ariaLabel: string) => {
  node.setAttribute('aria-label', ariaLabel);
  node.setAttribute('role', 'button');
  node.setAttribute('href', 'javascript:undefined');
};

export const trackMessagesDelivered = (
  messages: Partial<InAppMessage>[] = []
) => {
  return Promise.all(
    messages?.map((eachMessage) => {
      return trackInAppDelivery({
        messageId: eachMessage.messageId as string
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
