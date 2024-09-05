import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from '../../embedded/utils';
import { OOTB } from '../types';
import {
  defaultNotificationStyles,
  defaultTextParentStyles,
  defaultTitleStyles,
  defaultBodyStyles,
  defaultButtonStyles,
  defaultPrimaryButtonStyle,
  defaultButtonsDiv
} from './styles';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedNotification({
  appPackageName,
  message,
  htmlElements = {
    parent: emptyElement,
    title: emptyElement,
    primaryButton: emptyElement,
    secondaryButton: emptyElement,
    body: emptyElement,
    buttonsDiv: emptyElement,
    textTitle: emptyElement
  },
  errorCallback
}: OOTB): string {
  const notificationSelector = `${message?.metadata?.messageId}-notification`;
  const primaryButtonSelector = `${message?.metadata?.messageId}-notification-primaryButton`;
  const secondaryButtonSelector = `${message?.metadata?.messageId}-notification-secondaryButton`;

  setTimeout(() => {
    const notificationDiv = document.getElementsByName(notificationSelector)[0];
    const primaryButtonClick = document.getElementsByName(
      primaryButtonSelector
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      secondaryButtonSelector
    )[0];
    if (notificationDiv && message?.elements?.defaultAction) {
      notificationDiv.addEventListener('click', () =>
        handleElementClick(message, appPackageName, errorCallback)
      );
    }

    if (primaryButtonClick) {
      addButtonClickEvent(
        primaryButtonClick,
        0,
        message,
        appPackageName,
        errorCallback
      );
    }
    if (secondaryButtonClick) {
      addButtonClickEvent(
        secondaryButtonClick,
        1,
        message,
        appPackageName,
        errorCallback
      );
    }
  }, 0);

  const trimmedTitle = getTrimmedText(message?.elements?.title);
  const trimmedBody = getTrimmedText(message?.elements?.body);

  if (
    !(
      trimmedTitle.length ||
      trimmedBody.length ||
      message?.elements?.buttons?.length ||
      message?.elements?.mediaUrl
    )
  ) {
    return '';
  }

  return `
    <div 
      id="${htmlElements?.parent?.id}"
      name="${notificationSelector}"
      style="${defaultNotificationStyles(message?.elements?.defaultAction)} ${
    htmlElements?.parent?.styles
  }" 
    >
      <div
        id="${htmlElements?.textTitle?.id}"
        style="${defaultTextParentStyles} ${htmlElements?.textTitle?.styles}"
      >
        <p id="${htmlElements?.title?.id}" style="${defaultTitleStyles} ${
    htmlElements?.title?.styles
  }">
            ${trimmedTitle}
        </p>
        <p id="${htmlElements?.body?.id}" style="${defaultBodyStyles} ${
    htmlElements?.body?.styles
  }">
          ${trimmedBody}
        </p>
      </div>
      <div id="${htmlElements?.buttonsDiv?.id}" style="${defaultButtonsDiv} ${
    htmlElements?.buttonsDiv?.styles
  }">
      ${
        message?.elements?.buttons?.[0]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${
                 htmlElements?.primaryButton?.disabledStyles
                   ? 'disabled'
                   : 'enabled'
               } 
               data-index="0"
               name="${primaryButtonSelector}"
               id="${htmlElements?.primaryButton?.id}"
               style="${defaultButtonStyles} ${defaultPrimaryButtonStyle} ${
              htmlElements?.primaryButton?.styles
            } ${htmlElements?.primaryButton?.disabledStyles}"
             >
             ${message?.elements?.buttons?.[0]?.title}
           </button>`
          : ''
      }
      ${
        message?.elements?.buttons?.[1]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${
                 htmlElements?.secondaryButton?.disabledStyles
                   ? 'disabled'
                   : 'enabled'
               } 
               data-index="1"
               name="${secondaryButtonSelector}"
               id="${htmlElements?.secondaryButton?.id}"
               style="
               ${defaultButtonStyles}
               ${htmlElements?.secondaryButton?.disabledStyles}"
             >
               ${message?.elements?.buttons?.[1]?.title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
