/* eslint-disable no-use-before-define */
import {
  URL_SCHEME_ACTION,
  URL_SCHEME_ITBL,
  URL_SCHEME_OPEN
} from '../constants';
import { trackEmbeddedClick } from '../events/embedded/events';
import {
  IterableEmbeddedButton,
  IterableAction,
  IterableActionSource,
  IterableEmbeddedMessage,
  IterableEmbeddedDefaultAction
} from './types';
import { IterableActionRunner } from '../utils/IterableActionRunner';
import { ErrorHandler } from '../types';

function getTargetUrl(action?: IterableEmbeddedDefaultAction): string {
  if (!action) return '';

  if (action.type === URL_SCHEME_OPEN) {
    return action?.data || '';
  }
  return action.type;
}

export const handleElementClick = (
  message: IterableEmbeddedMessage,
  appPackageName: string,
  errorCallback?: ErrorHandler
) => {
  const targetUrl = getTargetUrl(message?.elements?.defaultAction);
  handleEmbeddedClick(targetUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: '',
    targetUrl,
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
  const targetUrl = getTargetUrl(button?.action);
  handleEmbeddedClick(targetUrl);
  trackEmbeddedClick({
    messageId: message.metadata.messageId,
    buttonIdentifier: button?.id || '',
    targetUrl,
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
): void => {
  button.addEventListener('click', (event) => {
    // Prevent the click event from bubbling up to the div
    event.stopPropagation();
    if (message?.elements?.buttons) {
      handleButtonClick(
        message?.elements?.buttons[index],
        message,
        appPackageName,
        errorCallback
      );
    }
  });
};

export const handleEmbeddedClick = (clickedUrl: string | null) => {
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

export function getTrimmedText(text: string | undefined) {
  const unsafeText = text && typeof text === 'string' ? text.trim() : '';
  return escapeHtml(unsafeText);
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
