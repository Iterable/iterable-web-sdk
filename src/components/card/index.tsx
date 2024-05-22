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
  elements = {
    parent: emptyElement,
    img: emptyElement,
    title: emptyElement,
    primaryButton: emptyElement,
    secondaryButton: emptyElement,
    body: emptyElement,
    buttonsDiv: emptyElement,
    textTitle: emptyElement
  },
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
      id="${elements?.parent?.id}"
      name="${cardSelector}"
      style="${defaultCardStyles(message?.elements?.defaultAction)} ${
    elements?.parent?.styles
  }" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img id="${elements?.img?.id}" style="${defaultImageStyles} ${elements?.img?.styles}" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div id="${elements?.textTitle?.id}" style="${defaultTextParentStyles}; ${
    elements?.textTitle?.styles
  }">
        ${
          trimmedTitle.length
            ? `<text class="titleText" id="${elements?.title?.id}" style="${defaultTitleStyles} ${elements?.title?.styles}">${trimmedTitle}</text>`
            : ''
        }
        ${
          trimmedBody.length
            ? `<text class="titleText" id="${elements?.body?.id}" style="${defaultBodyStyles} ${elements?.body?.styles}">${trimmedBody}</text>`
            : ''
        }
      </div>
      <div id="${elements?.buttonsDiv?.id}" style="${cardButtons}; ${
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
               style="${defaultButtonStyles} ${
              elements?.primaryButton?.styles
            } ${elements?.primaryButton?.disabledStyles}"
             >
             ${message.elements.buttons[0].title}
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
               style="${defaultButtonStyles} ${
              elements?.secondaryButton?.styles
            } ${elements?.secondaryButton?.disabledStyles}"
             >
               ${message.elements.buttons[1].title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
