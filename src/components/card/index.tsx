import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from 'src/embedded/utils';
import { OOTB } from '../types';
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
  htmlElements = {
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
  ) {
    return '';
  }
  return `
    <div 
      id="${htmlElements?.parent?.id}"
      name="${cardSelector}"
      style="${defaultCardStyles(message?.elements?.defaultAction)} ${
    htmlElements?.parent?.styles
  }" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img id="${htmlElements?.img?.id}" style="${defaultImageStyles} ${htmlElements?.img?.styles}" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div id="${
        htmlElements?.textTitle?.id
      }" style="${defaultTextParentStyles}; ${htmlElements?.textTitle?.styles}">
        ${
          trimmedTitle.length
            ? `<text class="titleText" id="${htmlElements?.title?.id}" style="${defaultTitleStyles} ${htmlElements?.title?.styles}">${trimmedTitle}</text>`
            : ''
        }
        ${
          trimmedBody.length
            ? `<text class="titleText" id="${htmlElements?.body?.id}" style="${defaultBodyStyles} ${htmlElements?.body?.styles}">${trimmedBody}</text>`
            : ''
        }
      </div>
      <div id="${htmlElements?.buttonsDiv?.id}" style="${cardButtons}; ${
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
               style="${defaultButtonStyles} ${
              htmlElements?.primaryButton?.styles
            } ${htmlElements?.primaryButton?.disabledStyles}"
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
                 htmlElements?.secondaryButton?.disabledStyles
                   ? 'disabled'
                   : 'enabled'
               } 
               data-index="1"
               name="${secondaryButtonSelector}"
               id="${htmlElements?.secondaryButton?.id}"
               style="${defaultButtonStyles} ${
              htmlElements?.secondaryButton?.styles
            } ${htmlElements?.secondaryButton?.disabledStyles}"
             >
               ${message.elements.buttons[1].title}
           </button>`
          : ''
      }
      </div>
    </div>
  `;
}
