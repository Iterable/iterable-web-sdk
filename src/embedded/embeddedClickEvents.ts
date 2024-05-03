import { trackEmbeddedClick } from '../events/embedded/events';
import {
  IterableEmbeddedButton,
  IterableAction,
  IterableActionRunner,
  IterableActionSource,
  IterableEmbeddedMessage
} from '../embedded';
import { ErrorHandler } from '../types';
import {
  URL_SCHEME_ACTION,
  URL_SCHEME_ITBL,
  URL_SCHEME_OPEN
} from 'src/constants';

function getClickedUrl(action?: any): string {
  if (!action) return '';

  if (action.type === URL_SCHEME_OPEN) {
    return action?.data || '';
  } else {
    return action.type;
  }
}

export const handleElementClick = (
  message: IterableEmbeddedMessage,
  appPackageName: string,
  errorCallback?: ErrorHandler
) => {
  const clickedUrl = getClickedUrl(message?.elements?.defaultAction);
  handleEmbeddedClick(clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: '',
    clickedUrl: clickedUrl,
    appPackageName
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
  button: IterableEmbeddedButton,
  message: IterableEmbeddedMessage,
  appPackageName: string,
  errorCallback?: ErrorHandler
) => {
  const clickedUrl = getClickedUrl(button?.action);
  handleEmbeddedClick(clickedUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: button?.id || '',
    clickedUrl,
    appPackageName
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
  appPackageName: string,
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
      appPackageName,
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
