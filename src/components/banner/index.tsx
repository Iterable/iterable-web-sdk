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
import {
  addButtonClickEvent,
  getTrimmedText,
  handleElementClick
} from 'src/embedded/utils';

const emptyElement = {
  id: '',
  styles: ''
};

export function IterableEmbeddedBanner({
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
  textTitleImg = emptyElement,
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
      id="${parent?.id}"
      name="${bannerSelector}"
      style="${defaultBannerStyles(message?.elements?.defaultAction)} ${
    parent?.styles || ''
  }" 
    >
      <div id="${textTitleImg?.id}" style="${textTitleImageDefaultStyle}; ${
    textTitleImg?.styles || ''
  }">
        <div id="${textTitle?.id}" style="${defaultTextParentStyles}; ${
    textTitle?.styles || ''
  }">
          ${
            trimmedTitle.length
              ? `<text id="${title?.id}" style="${defaultTitleStyles}; ${
                  title?.styles || ''
                }">${trimmedTitle}</text>`
              : ''
          }
          ${
            trimmedBody.length
              ? `<text id="${body?.id}" style="${defaultBodyStyles}; ${
                  body?.styles || ''
                }">${trimmedBody}</text>`
              : ''
          }
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img id="${img?.id}" style="${defaultImageStyles}; ${
                img?.styles || ''
              }" src="${message?.elements?.mediaUrl}" />`
            : ''
        }
      </div>
      <div id="${buttonsDiv?.id}" style="${bannerButtons}; ${
    buttonsDiv?.styles
  }">
       ${
         message?.elements?.buttons?.[0]
           ? `<button 
                key="button-${message?.metadata.messageId}" 
                ${primaryButton?.disabledStyles ? 'disabled' : 'enabled'} 
                data-index="0"
                name="${primaryButtonSelector}"
                id="${primaryButton?.id}"
                class="banner-button" 
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
                class="banner-button" 
                style="${defaultButtonStyles} ${
               secondaryButton?.styles || ''
             } ${secondaryButton?.disabledStyles || ''}"
              >
                ${message?.elements?.buttons?.[1]?.title}
            </button>`
           : ''
       }
      </div>
    </div>
  `;
}
