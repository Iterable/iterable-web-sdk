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
import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from 'src/embedded/utils';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedNotification({
  appPackageName,
  message,
  parent = emptyElement,
  title = emptyElement,
  primaryButton = emptyElement,
  secondaryButton = emptyElement,
  body = emptyElement,
  buttonsDiv = emptyElement,
  textTitle = emptyElement,
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
  )
    return '';

  return `
    <div 
      id="${parent?.id}"
      name="${notificationSelector}"
      style="${defaultNotificationStyles(message?.elements?.defaultAction)} ${
    parent?.styles
  }" 
    >
      <div
        id="${textTitle?.id}"
        style="${defaultTextParentStyles} ${textTitle?.styles || ''}"
      >
        <p id="${title?.id}" style="${defaultTitleStyles} ${
    title?.styles || ''
  }">
            ${trimmedTitle}
        </p>
        <p id="${body?.id}" style="${defaultBodyStyles} ${body?.styles || ''}">
          ${trimmedBody}
        </p>
      </div>
      <div id="${buttonsDiv?.id}" style="${defaultButtonsDiv} ${
    buttonsDiv?.styles || ''
  }">
      ${
        message?.elements?.buttons?.[0]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${primaryButton?.disabledStyles ? 'disabled' : 'enabled'} 
               data-index="0"
               name="${primaryButtonSelector}"
               id="${primaryButton?.id}"
               style="${defaultButtonStyles} ${defaultPrimaryButtonStyle} ${
              primaryButton?.styles || ''
            } ${primaryButton?.disabledStyles || ''}"
             >
             ${message?.elements?.buttons?.[0]?.title}
           </button>`
          : ''
      }
      ${
        message?.elements?.buttons?.[1]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${secondaryButton?.disabledStyles ? 'disabled' : 'enabled'} 
               data-index="1"
               name="${secondaryButtonSelector}"
               id="${secondaryButton?.id}"
               style="
               ${defaultButtonStyles}
               ${secondaryButton?.disabledStyles || ''}"
             >
               ${message?.elements?.buttons?.[1]?.title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
