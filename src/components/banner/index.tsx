import { EmbeddedMessageData } from '../types';
import { EmbeddedMessageElementsButton } from '../../embedded';
import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';

export function Banner({
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
  message,
  titleId = 'banner-title',
  textId = 'banner-text',
  primaryButtonId = 'banner-primary-button',
  secondaryButtonId = 'banner-secondary-button',
  parentId = 'banner-parent',
  imageId = 'banner-image',
  buttonsDivId = 'banner-buttons-div',
  textTitleDivId = 'banner-text-title-div',
  textTitleImageDivId = 'banner-text-title-image-div'
}: EmbeddedMessageData): string {
  const defaultBannerStyles = `
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px 20px 15px 20px;
    ${message?.elements?.defaultAction ? 'cursor: pointer;' : 'auto'}
  `;
  const defaultImageStyles = `
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin-left: 10px;
    object-fit: cover;
  `;
  const defaultTitleStyles = `
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
    display: block;
  `;
  const defaultTextStyles = `
    font-size: 16px;
    margin-bottom: 10px;
    display: block;
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
    background-color: transparent;
    color: #433d99;
    border: none;
    border-radius: 0;
    cursor: pointer;
    padding: 5px;
    min-width: fit-content;
  `;
  const defaultTextParentStyles = `
    flex: 1;
    max-width: calc(100% - 80px);
  `;
  const mediaStyle = `
    @media screen and (max-width: 800px) {
      .titleText {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2.6em;
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
    if (bannerDiv) {
      bannerDiv.addEventListener('click', () => handleElementClick(message));
    }
    if (primaryButtonClick) {
      addButtonClickEvent(primaryButtonClick, 0, message);
    }
    if (secondaryButtonClick) {
      addButtonClickEvent(secondaryButtonClick, 1, message);
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
          ?.map((button: EmbeddedMessageElementsButton, index: number) => {
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
                style="${defaultButtonStyles};  
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
