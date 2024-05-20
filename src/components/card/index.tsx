import { OOTB } from '../types';
import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from 'src/embedded/utils';
import {
  defaultCardStyles,
  defaultImageStyles,
  defaultTextParentStyles,
  defaultBodyStyles,
  defaultTitleStyles,
  cardButtons,
  defaultButtonStyles
} from './styles';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedCard({
  appPackageName,
  message,
  parent = emptyElement,
  img = emptyElement,
  title = emptyElement,
  primaryButton = emptyElement,
  secondaryButton = emptyElement,
  body = emptyElement,
  buttonsDiv = emptyElement,
  textTitle = emptyElement,
  errorCallback
}: OOTB): string {
  const cardSelector = `${message?.metadata?.messageId}-card`;
  const primaryButtonSelector = `${message?.metadata?.messageId}-card-primaryButton`;
  const secondaryButtonSelector = `${message?.metadata?.messageId}-card-secondaryButton`;
  setTimeout(() => {
    const cardDiv = document.getElementsByName(cardSelector)[0];
    const primaryButtonClick = document.getElementsByName(
      primaryButtonSelector
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      secondaryButtonSelector
    )[0];
    if (cardDiv && message?.elements?.defaultAction) {
      cardDiv.addEventListener('click', () =>
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
      id="${parent?.id || ''}"
      name="${cardSelector}"
      style="${defaultCardStyles(message?.elements?.defaultAction)}; ${
    parent?.styles || ''
  }" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img id="${img?.id}" style="${defaultImageStyles}; ${
              img?.styles || ''
            }" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div id="${textTitle?.id}" style="${defaultTextParentStyles}; ${
    textTitle?.styles || ''
  }">
        ${
          trimmedTitle.length
            ? `<text class="titleText" id="${
                title?.id
              }" style="${defaultTitleStyles}; ${
                title?.styles || ''
              }">${trimmedTitle}</text>`
            : ''
        }
        ${
          trimmedBody.length
            ? `<text class="titleText" id="${
                body?.id
              }" style="${defaultBodyStyles}; ${
                body || ''
              }">${trimmedBody}</text>`
            : ''
        }
      </div>
      <div id="${buttonsDiv?.id}" style="${cardButtons}; ${
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
               style="${defaultButtonStyles} ${primaryButton?.styles || ''} ${
              primaryButton?.disabledStyles || ''
            }"
             >
             ${message.elements.buttons[0].title}
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
               style="${defaultButtonStyles} ${secondaryButton?.styles || ''} ${
              secondaryButton?.disabledStyles || ''
            }"
             >
               ${message.elements.buttons[1].title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
