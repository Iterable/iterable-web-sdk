import {
  EmbeddedMessageElementsButton,
  IterableAction,
  IterableActionRunner,
  IterableActionSource,
  IterableEmbeddedMessage
} from '../embedded';
import { ErrorHandler, trackEmbeddedClick } from '..';
import {
  URL_SCHEME_ACTION,
  URL_SCHEME_ITBL,
  URL_SCHEME_OPEN
} from 'src/constants';

export const handleElementClick = (
  message: IterableEmbeddedMessage,
  errorCallback?: ErrorHandler
) => {
  const clickedUrl =
    message?.elements?.defaultAction?.data?.trim() ||
    message?.elements?.defaultAction?.type ||
    null;
  handleEmbeddedClick(clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: '',
    clickedUrl: clickedUrl ? clickedUrl : ''
  }).catch((error) => {
    if (errorCallback) {
      errorCallback({
        ...error?.response?.data,
        statusCode: error?.response?.status
      });
    }
  });
};

export const handleButtonClick = (
  button: EmbeddedMessageElementsButton,
  message: IterableEmbeddedMessage,
  errorCallback?: ErrorHandler
) => {
  const clickedUrl = button?.action?.data?.trim() || button?.action?.type || '';
  handleEmbeddedClick(clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: button?.id || '',
    clickedUrl
  }).catch((error) => {
    if (errorCallback) {
      errorCallback({
        ...error?.response?.data,
        statusCode: error?.response?.status
      });
    }
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

const handleEmbeddedClick = (clickedUrl: string | null) => {
  if (clickedUrl && clickedUrl.trim() !== '') {
    let actionType: string;
    let actionName: string;

    if (clickedUrl.startsWith(URL_SCHEME_ACTION)) {
      actionName = '';
      actionType = clickedUrl;
    } else if (clickedUrl.startsWith(URL_SCHEME_ITBL)) {
      actionName = '';
      actionType = clickedUrl.replace(URL_SCHEME_ITBL, '');
    } else {
      actionType = URL_SCHEME_OPEN;
      actionName = clickedUrl;
    }

    const iterableAction: IterableAction = {
      type: actionType,
      data: actionName
    };

    IterableActionRunner.executeAction(
      null,
      iterableAction,
      IterableActionSource.EMBEDDED
    );
  }
};
