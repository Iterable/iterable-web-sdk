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
  elements = {
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
  )
    return '';

  return `
    <div 
      id="${elements?.parent?.id}"
      name="${notificationSelector}"
      style="${defaultNotificationStyles(message?.elements?.defaultAction)} ${
    elements?.parent?.styles
  }" 
    >
      <div
        id="${elements?.textTitle?.id}"
        style="${defaultTextParentStyles} ${elements?.textTitle?.styles}"
      >
        <p id="${elements?.title?.id}" style="${defaultTitleStyles} ${
    elements?.title?.styles
  }">
            ${trimmedTitle}
        </p>
        <p id="${elements?.body?.id}" style="${defaultBodyStyles} ${
    elements?.body?.styles
  }">
          ${trimmedBody}
        </p>
      </div>
      <div id="${elements?.buttonsDiv?.id}" style="${defaultButtonsDiv} ${
    elements?.buttonsDiv?.styles
  }">
      ${
        message?.elements?.buttons?.[0]
          ? `<button 
               key="button-${message?.metadata.messageId}" 
               ${
                 elements?.primaryButton?.disabledStyles
                   ? 'disabled'
                   : 'enabled'
               } 
               data-index="0"
               name="${primaryButtonSelector}"
               id="${elements?.primaryButton?.id}"
               style="${defaultButtonStyles} ${defaultPrimaryButtonStyle} ${
              elements?.primaryButton?.styles
            } ${elements?.primaryButton?.disabledStyles}"
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
                 elements?.secondaryButton?.disabledStyles
                   ? 'disabled'
                   : 'enabled'
               } 
               data-index="1"
               name="${secondaryButtonSelector}"
               id="${elements?.secondaryButton?.id}"
               style="
               ${defaultButtonStyles}
               ${elements?.secondaryButton?.disabledStyles}"
             >
               ${message?.elements?.buttons?.[1]?.title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
