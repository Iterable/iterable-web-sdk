import { by } from '@pabra/sortby';
import { InAppMessage } from './types';
import srSpeak from 'src/utils/srSpeak';
import { trackInAppDelivery } from '../events';

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
 * @param srMessage The message you want the screen reader to read when popping up the message
 * @returns { HTMLIFrameElement }
 */
export const paintIFrame = (html: string, srMessage?: string) => {
  const iframe = document.createElement('iframe');
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
  document.body.appendChild(iframe);
  iframe.contentWindow?.document?.open();
  iframe.contentWindow?.document?.write(html);
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

export const paintOverlay = (
  color = '#fff',
  opacity = 0,
  handleDismiss: () => void
) => {
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

  overlay.addEventListener('click', () => {
    handleDismiss();
    overlay.remove();
  });
  document.body.appendChild(overlay);
  return overlay;
};
