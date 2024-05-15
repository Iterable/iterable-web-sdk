import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';
import { IterableEmbeddedButton } from 'src/embedded';
import { EmbeddedMessageData } from '../types';

export function IterableEmbeddedBanner({
  appPackageName,
  message,
  parentStyle,
  disablePrimaryBtn = false,
  disableSecondaryBtn = false,
  imgStyle,
  primaryBtnStyle,
  primaryDisableBtnStyle,
  secondaryBtnStyle,
  secondaryDisableBtnStyle,
  textStyle,
  titleStyle,
  titleId = 'banner-title',
  textId = 'banner-text',
  primaryButtonId = 'banner-primary-button',
  secondaryButtonId = 'banner-secondary-button',
  parentId = 'banner-parent',
  imageId = 'banner-image',
  buttonsDivId = 'banner-buttons-div',
  textTitleDivId = 'banner-text-title-div',
  textTitleImageDivId = 'banner-text-title-image-div',
  errorCallback
}: EmbeddedMessageData): string {
  const defaultBannerStyles = `
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px 20px 15px 20px;
    cursor: ${message?.elements?.defaultAction ? 'pointer' : 'auto'};
  `;
  const defaultImageStyles = `
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin-left: 10px;
    object-fit: cover;
    margin-top: 5px;
  `;
  const defaultTitleStyles = `
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
    color: rgb(61, 58, 59);
    display: block;
  `;
  const defaultTextStyles = `
    font-size: 17px;
    margin-bottom: 10px;
    display: block;
    margin-bottom: 25px;
    color: rgb(120, 113, 116);
  `;
  const bannerButtons = `
    margin-top: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 0.2em;
  `;
  const defaultButtonStyles = `
    max-width: calc(50% - 32px);
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    padding: 8px 0px;
    min-width: fit-content;
    margin-right: 12px;
    color: #622a6a;
    background: none;
  `;
  const defaultTextParentStyles = `
    flex: 1;
    max-width: calc(100% - 80px);
  `;
  const mediaStyle = `
    @media screen and (max-width: 800px) {
      .titleText {
        line-height: 1.3em;
      }
      .banner {
        display: flex;
        flex-direction: column;
        min-width: fit-content;
      }
    }
  `;

  setTimeout(() => {
    const bannerDiv = document.getElementsByName(
      `${message?.metadata?.messageId}-banner`
    )[0];
    const primaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-banner-primaryButton`
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-banner-secondaryButton`
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

  const getStyleObj = (index: number) => {
    return {
      buttonStyle: index === 0 ? primaryBtnStyle : secondaryBtnStyle,
      disableStyle:
        index === 0 ? primaryDisableBtnStyle : secondaryDisableBtnStyle,
      disableButton:
        index === 0
          ? disablePrimaryBtn
            ? 'disabled'
            : 'enabled'
          : disableSecondaryBtn
          ? 'disabled'
          : 'enabled'
    };
  };

  return `
    <style>${mediaStyle}</style>
    <div 
      class="banner" 
      id="${parentId}"
      name="${message?.metadata?.messageId}-banner"
      style="${defaultBannerStyles}; ${parentStyle || ''}" 
    >
      <div id="${textTitleImageDivId}"
      style="display: flex; flex-direction: row;">
        <div
        id="${textTitleDivId}"
        style="${defaultTextParentStyles}">
          <text class="titleText"  id="${titleId}" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
            ${message?.elements?.title || 'Title Here'}
          </text>
          <text class="titleText" id="${textId}" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
            ${message?.elements?.body}
          </text>
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img id="${imageId}"
            style="${defaultImageStyles}; ${imgStyle || ''}" src="${
                message?.elements?.mediaUrl
              }" />`
            : ''
        }
      </div>
      <div id="${buttonsDivId}"
       style="${bannerButtons}">
        ${message?.elements?.buttons
          ?.map((button: IterableEmbeddedButton, index: number) => {
            const buttonStyleObj = getStyleObj(index);
            return `
              <button 
                key="${index}" 
                ${buttonStyleObj.disableButton} 
                data-index="${index}"
                name="${message?.metadata?.messageId}${
              index === 0 ? '-banner-primaryButton' : '-banner-secondaryButton'
            }"
                id="${index === 0 ? primaryButtonId : secondaryButtonId}"
                class="banner-button-primary-secondary" 
                style="
                ${defaultButtonStyles}; 
                ${
                  index === 0
                    ? 'background: #622a6a; color: white; padding: 8px 12px;'
                    : ''
                }
                ${buttonStyleObj.buttonStyle || ''} 
                ${buttonStyleObj.disableStyle || ''}"
              >
                ${button.title ? button.title : `Button ${index + 1}`}
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}
