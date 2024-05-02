import {
  IterableEmbeddedManager,
  IterableEmbeddedButton,
  IterableEmbeddedMessage
} from '../embedded';

export const handleElementClick = (
  embeddedManager: IterableEmbeddedManager,
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
  embeddedManager: IterableEmbeddedManager,
  button: IterableEmbeddedButton,
  message: IterableEmbeddedMessage
) => {
  const clickedUrl = button?.action?.data?.trim() || button?.action?.type || '';
  embeddedManager.handleEmbeddedClick(clickedUrl);
  embeddedManager.trackEmbeddedClick(message, button?.id || '', clickedUrl);
};

export const addButtonClickEvent = (
  embeddedManager: IterableEmbeddedManager,
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
