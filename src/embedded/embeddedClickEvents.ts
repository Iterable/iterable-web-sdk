import {
  EmbeddedManager,
  EmbeddedMessageElementsButton,
  IterableEmbeddedMessage
} from '../embedded';

export const handleElementClick = (
  embeddedManager: EmbeddedManager,
  message: IterableEmbeddedMessage
) => {
  const clickedUrl =
    message?.elements?.defaultAction?.data?.trim() ||
    message?.elements?.defaultAction?.type ||
    null;
  embeddedManager.handleEmbeddedClick(clickedUrl);
  embeddedManager.trackEmbeddedClick(message, '', clickedUrl ? clickedUrl : '');
};

export const handleButtonClick = (
  embeddedManager: EmbeddedManager,
  button: EmbeddedMessageElementsButton,
  message: IterableEmbeddedMessage
) => {
  const clickedUrl = button?.action?.data?.trim() || button?.action?.type || '';
  embeddedManager.handleEmbeddedClick(clickedUrl);
  embeddedManager.trackEmbeddedClick(message, button?.id || '', clickedUrl);
};

export const addButtonClickEvent = (
  embeddedManager: EmbeddedManager,
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
    handleButtonClick(
      embeddedManager,
      message?.elements?.buttons[index],
      message
    );
  });
};
