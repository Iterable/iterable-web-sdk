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
  iframe.style.position = 'fixed';
  iframe.style.border = 'none';
  iframe.style.height = '100vh';
  iframe.style.width = '100vw';
  iframe.style.top = '0';
  iframe.style.left = '0';
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
  for (let i = 0; i < messages.length; i++) {
    if (!!messages[i].messageId) {
      trackInAppDelivery({
        messageId: messages[i].messageId as string
      });
    }
  }
};
