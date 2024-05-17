import { OOTB } from '../types';
import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';
import {
  defaultNotificationStyles,
  defaultTextParentStyles,
  defaultTitleStyles,
  defaultBodyStyles,
  defaultButtonStyles,
  defaultPrimaryButtonStyle,
  defaultButtonsDiv
} from './styles';

export function IterableEmbeddedNotification({
  appPackageName,
  message,
  parent,
  title,
  primaryButton,
  secondaryButton,
  body,
  buttonsDiv,
  textTitle,
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
    if (notificationDiv) {
      notificationDiv.addEventListener('click', () =>
        handleElementClick(message, appPackageName, errorCallback)
      );
    }
    console.log({ primaryButtonClick, secondaryButtonClick, notificationDiv });
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

  return `
    <div 
      id="${parent?.id}"
      name="${notificationSelector}"
      style="${defaultNotificationStyles(message?.elements?.defaultAction)}" 
    >
      <div
        id="${textTitle?.id}"
        style="${defaultTextParentStyles}; ${textTitle?.styles || ''}"
      >
        <p id="${title?.id}" style="${defaultTitleStyles}; ${
    title?.styles || ''
  }">
            ${message?.elements?.title}
        </p>
        <p id="${body?.id}" style="${defaultBodyStyles}; ${body?.styles || ''}">
          ${message?.elements?.body}
        </p>
      </div>
      <div id="${buttonsDiv?.id}" style="${defaultButtonsDiv}; ${
    buttonsDiv?.styles || ''
  }">
      ${
        message?.elements?.buttons?.[0]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${primaryButton?.disabled ? 'disabled' : 'enabled'} 
               data-index="${0}"
               name="${primaryButtonSelector}"
               id="${primaryButton?.id}"
               style="${defaultButtonStyles};  ${defaultPrimaryButtonStyle}; ${
              primaryButton?.styles || ''
            }; ${primaryButton?.disabledStyles || ''};"
             >
             ${message?.elements?.buttons?.[0]?.title}
           </button>`
          : ''
      }
      ${
        message?.elements?.buttons?.[1]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${secondaryButton?.disabled ? 'disabled' : 'enabled'} 
               data-index="${0}"
               name="${secondaryButtonSelector}"
               id="${secondaryButton?.id}"
               style="
               ${defaultButtonStyles}; 
               ${secondaryButton?.disabledStyles || ''};"
             >
               ${message?.elements?.buttons?.[1]?.title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
