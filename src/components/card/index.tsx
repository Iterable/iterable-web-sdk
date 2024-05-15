import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';
import { IterableEmbeddedButton } from 'src/embedded';
import { EmbeddedMessageData } from '../types';

export function IterableEmbeddedCard({
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
  titleId = 'card-title',
  textId = 'card-text',
  primaryButtonId = 'card-primary-button',
  secondaryButtonId = 'card-secondary-button',
  parentId = 'card-parent',
  imageId = 'card-image',
  buttonsDivId = 'card-buttons-div',
  textTitleDivId = 'card-text-title-div',
  errorCallback
}: EmbeddedMessageData): string {
  const defaultCardStyles = `
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    cursor: ${message?.elements?.defaultAction ? 'pointer' : 'auto'};
  `;
  const defaultImageStyles = `
    width: 100%;
    aspect-ratio: 16/9;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    object-fit: cover;
  `;
  const defaultTitleStyles = `
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 9px;
    color: rgb(61, 58, 59);
    display: block;
  `;
  const defaultTextStyles = `
    font-size: 17px;
    margin-bottom: 10px;
    display: block;
    color: rgb(120, 113, 116);
  `;
  const defaultButtonStyles = `
    max-width: calc(50% - 32px);
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    background-color: transparent;
    color: ${disablePrimaryBtn ? 'grey' : '#622a6a'};
    border: none;
    border-radius: 0;
    cursor: pointer;
    padding: 5px;
    min-width: fit-content;
  `;

  const defaultTextParentStyles = `
    overflow-wrap: break-word;
    margin: 10px;
  `;

  const cardButtons = `
    margin-top: auto;
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  `;

  const mediaStyle = `
    @media screen and (max-width: 800px) {
        .titleText {
          line-height: 1.3em;
        }
        .card {
          display: flex;
          flex-direction: column;
        }
      }
    `;

  setTimeout(() => {
    const cardDiv = document.getElementsByName(
      `${message?.metadata?.messageId}-card`
    )[0];
    const primaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-card-primaryButton`
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-card-secondaryButton`
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
      class="card"
      id="${parentId}"
      name="${message?.metadata?.messageId}-card"
      style="${defaultCardStyles}; ${parentStyle || ''}" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img id="${imageId}" style="${defaultImageStyles}; ${
              imgStyle || ''
            }" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div id="${textTitleDivId}" style="${defaultTextParentStyles}">
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
      <div id="${buttonsDivId}" style="${cardButtons}">
        ${message?.elements?.buttons
          ?.map((button: IterableEmbeddedButton, index: number) => {
            const buttonStyleObj = getStyleObj(index);
            return `
              <button 
                key="${index}" 
                ${buttonStyleObj.disableButton} 
                data-index="${index}"
                name="${message?.metadata?.messageId}${
              index === 0 ? '-card-primaryButton' : '-card-secondaryButton'
            }"
                id="${index === 0 ? primaryButtonId : secondaryButtonId}"
                class="card-button-primary-secondary" 
                style="
                  ${defaultButtonStyles}; 
                  ${buttonStyleObj.buttonStyle || ''}; 
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
