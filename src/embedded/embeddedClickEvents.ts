import {
  EmbeddedManager,
  EmbeddedMessageElementsButton,
  IterableEmbeddedMessage
} from '../embedded';
import { ErrorHandler, trackEmbeddedClick } from '..';

const embeddedManager = new EmbeddedManager();
export const handleElementClick = (
  message: IterableEmbeddedMessage,
  errorCallback?: ErrorHandler
) => {
  const clickedUrl =
    message?.elements?.defaultAction?.data?.trim() ||
    message?.elements?.defaultAction?.type ||
    null;
  embeddedManager.handleEmbeddedClick(message, null, clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: '',
    clickedUrl: clickedUrl ? clickedUrl : '',
    errorCallback
  });
};

export const handleButtonClick = (
  button: EmbeddedMessageElementsButton,
  message: IterableEmbeddedMessage,
  errorCallback?: ErrorHandler
) => {
  const embeddedManager = new EmbeddedManager();
  const clickedUrl = button?.action?.data?.trim() || button?.action?.type || '';
  embeddedManager.handleEmbeddedClick(message, button?.id || null, clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: button?.id || '',
    clickedUrl,
    errorCallback
  });
};

export const addButtonClickEvent = (
  button: HTMLElement,
  index: number,
  message: IterableEmbeddedMessage,
  errorCallback?: ErrorHandler
) => {
  button.addEventListener('click', (event) => {
    // Prevent the click event from bubbling up to the div
    event.stopPropagation();
    if (!message?.elements?.buttons) {
      return '';
    }
    handleButtonClick(
      message?.elements?.buttons[index],
      message,
      errorCallback
    );
  });
};
