import { handleElementClick } from 'src/embedded/utils';
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
import { addButtonClickEvent, getTrimmedText } from 'src/embedded/utils';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedBanner({
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
  )
    return '';

  return `
    <div 
      id="${elements?.parent?.id}"
      name="${bannerSelector}"
      style="${defaultBannerStyles(message?.elements?.defaultAction)} ${
    elements?.parent?.styles
  }" 
    >
      <div id="${
        elements?.textTitleImg?.id
      }" style="${textTitleImageDefaultStyle}; ${
    elements?.textTitleImg?.styles
  }">
        <div id="${
          elements?.textTitle?.id
        }" style="${defaultTextParentStyles}; ${elements?.textTitle?.styles}">
          ${
            trimmedTitle.length
              ? `<text id="${elements?.title?.id}" style="${defaultTitleStyles}; ${elements?.title?.styles}">${trimmedTitle}</text>`
              : ''
          }
          ${
            trimmedBody.length
              ? `<text id="${elements?.body?.id}" style="${defaultBodyStyles}; ${elements?.body?.styles}">${trimmedBody}</text>`
              : ''
          }
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img id="${elements?.img?.id}" style="${defaultImageStyles}; ${elements?.img?.styles}" src="${message?.elements?.mediaUrl}" />`
            : ''
        }
      </div>
      <div id="${elements?.buttonsDiv?.id}" style="${bannerButtons}; ${
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
                class="banner-button" 
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
                class="banner-button" 
                style="${defaultButtonStyles} ${
               elements?.secondaryButton?.styles
             } ${elements?.secondaryButton?.disabledStyles}"
              >
                ${message?.elements?.buttons?.[1]?.title}
            </button>`
           : ''
       }
      </div>
    </div>
  `;
}
