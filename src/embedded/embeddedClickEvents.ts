import {
  EmbeddedManager,
  EmbeddedMessageElementsButton,
  IterableEmbeddedMessage
} from '../embedded';

const embeddedManager = new EmbeddedManager();
export const handleElementClick = (message: IterableEmbeddedMessage) => {
  const clickedUrl =
    message?.elements?.defaultAction?.data?.trim() ||
    message?.elements?.defaultAction?.type ||
    null;
  embeddedManager.handleEmbeddedClick(message, null, clickedUrl);
  embeddedManager.trackEmbeddedClick(message, '', clickedUrl ? clickedUrl : '');
};

export const handleButtonClick = (
  button: EmbeddedMessageElementsButton,
  message: IterableEmbeddedMessage
) => {
  const embeddedManager = new EmbeddedManager();
  const clickedUrl = button?.action?.data?.trim() || button?.action?.type || '';
  embeddedManager.handleEmbeddedClick(message, button?.id || null, clickedUrl);
  embeddedManager.trackEmbeddedClick(message, button?.id || '', clickedUrl);
};

export const addButtonClickEvent = (
  button: HTMLElement,
  index: number,
  message: IterableEmbeddedMessage
) => {
  button.addEventListener('click', (event) => {
    // Prevent the click event from bubbling up to the div
    event.stopPropagation();
    if (!message?.elements?.buttons) {
      return '';
    }
    handleButtonClick(message?.elements?.buttons[index], message);
  });
};
