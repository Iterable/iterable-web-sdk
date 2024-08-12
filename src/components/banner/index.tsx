import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from '../../embedded/utils';
import { OOTB } from '../types';
import {
  bannerButtons,
  defaultBannerStyles,
  defaultButtonStyles,
  defaultImageStyles,
  defaultPrimaryButtonStyle,
  defaultTextParentStyles,
  defaultBodyStyles,
  defaultTitleStyles,
  textTitleImageDefaultStyle
} from './styles';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedBanner({
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
    textTitle: emptyElement,
    textTitleImg: emptyElement
  },
  errorCallback
}: OOTB): string {
  const bannerSelector = `${message?.metadata?.messageId}-banner`;
  const primaryButtonSelector = `${message?.metadata?.messageId}-banner-primaryButton`;
  const secondaryButtonSelector = `${message?.metadata?.messageId}-banner-secondaryButton`;

  setTimeout(() => {
    const bannerDiv = document.getElementsByName(bannerSelector)[0];
    const primaryButtonClick = document.getElementsByName(
      primaryButtonSelector
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      secondaryButtonSelector
    )[0];
    if (bannerDiv && message?.elements?.defaultAction) {
      bannerDiv.addEventListener('click', () =>
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
      name="${bannerSelector}"
      style="${defaultBannerStyles(message?.elements?.defaultAction)} ${
    htmlElements?.parent?.styles
  }" 
    >
      <div id="${
        htmlElements?.textTitleImg?.id
      }" style="${textTitleImageDefaultStyle}; ${
    htmlElements?.textTitleImg?.styles
  }">
        <div id="${
          htmlElements?.textTitle?.id
        }" style="${defaultTextParentStyles}; ${
    htmlElements?.textTitle?.styles
  }">
          ${
            trimmedTitle.length
              ? `<text id="${htmlElements?.title?.id}" style="${defaultTitleStyles}; ${htmlElements?.title?.styles}">${trimmedTitle}</text>`
              : ''
          }
          ${
            trimmedBody.length
              ? `<text id="${htmlElements?.body?.id}" style="${defaultBodyStyles}; ${htmlElements?.body?.styles}">${trimmedBody}</text>`
              : ''
          }
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img id="${htmlElements?.img?.id}" style="${defaultImageStyles}; ${htmlElements?.img?.styles}" src="${message?.elements?.mediaUrl}" />`
            : ''
        }
      </div>
      <div id="${htmlElements?.buttonsDiv?.id}" style="${bannerButtons}; ${
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
                class="banner-button" 
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
                class="banner-button" 
                style="${defaultButtonStyles} ${
               htmlElements?.secondaryButton?.styles
             } ${htmlElements?.secondaryButton?.disabledStyles}"
              >
                ${message?.elements?.buttons?.[1]?.title}
            </button>`
           : ''
       }
      </div>
    </div>
  `;
}
