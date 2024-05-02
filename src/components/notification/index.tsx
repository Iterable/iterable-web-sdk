import { EmbeddedMessageData } from '../types';
import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';
import { IterableEmbeddedButton } from 'src/embedded';

export function IterableEmbeddedNotification({
  embeddedManager,
  message,
  disablePrimaryBtn = false,
  disableSecondaryBtn = false,
  primaryBtnStyle,
  primaryDisableBtnStyle,
  secondaryBtnStyle,
  secondaryDisableBtnStyle,
  textStyle,
  titleStyle,
  titleId = 'notification-title',
  textId = 'notification-text',
  primaryButtonId = 'notification-primary-button',
  secondaryButtonId = 'notification-secondary-button',
  parentId = 'notification-parent',
  buttonsDivId = 'notification-buttons-div',
  textTitleDivId = 'notification-text-title-div'
}: EmbeddedMessageData): string {
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
  const defaultTextParentStyles = `
    overflow-wrap: break-word;
  `;
  const defaultButtonStyles = `
    max-width: calc(50% - 32px); 
    text-align: left; 
   
    border-radius: 4px; 
    padding: 8px; 
    margin-right: 8px; 
    cursor: pointer; 
    border: none; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.06); 
    overflow-wrap: break-word; 
  `;
  const mediaStyle = `
    @media screen and (max-width: 800px) {
      .titleText {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2.6em;
        line-height: 1.3em;
      }
      .notification {
        min-height: 100px;
        display: flex;
        flex-direction: column;
      }
    }
  `;

  setTimeout(() => {
    const notificationDiv = document.getElementsByName(
      `${message?.metadata?.messageId}-notification`
    )[0];
    const primaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-notification-primaryButton`
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-notification-secondaryButton`
    )[0];
    if (notificationDiv) {
      notificationDiv.addEventListener('click', () =>
        handleElementClick(embeddedManager, message)
      );
    }
    if (primaryButtonClick) {
      addButtonClickEvent(embeddedManager, primaryButtonClick, 0, message);
    }
    if (secondaryButtonClick) {
      addButtonClickEvent(embeddedManager, secondaryButtonClick, 1, message);
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
      class="notification" 
      id="${parentId}"
      name="${message?.metadata?.messageId}-notification"
      style="background: white; border-radius: 10px; padding: 20px; border: 3px solid #caccd1; margin-bottom: 10px; cursor: ${
        message?.elements?.defaultAction ? 'pointer' : 'auto'
      };" 
    >
      <div class="notification" id="${textTitleDivId}"
       style="${defaultTextParentStyles}">
        <p class="titleText notification" id="${titleId}" 
        style="${defaultTitleStyles}; ${titleStyle || ''}">
          ${message?.elements?.title || 'Title Here'}
        </p>
        <p class="titleText notification" id="${textId}" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
          ${message?.elements?.body}
        </p>
      </div>
      <div class="notification" id="${buttonsDivId}" style="margin-top: auto;">
        ${message?.elements?.buttons
          ?.map((button: IterableEmbeddedButton, index: number) => {
            const buttonStyleObj = getStyleObj(index);
            return `
              <button 
                key="${index}" 
                ${buttonStyleObj.disableButton}  
                data-index="${index}"
                name="${message?.metadata?.messageId}${
              index === 0
                ? '-notification-primaryButton'
                : '-notification-secondaryButton'
            }"
                id="${index === 0 ? primaryButtonId : secondaryButtonId}"
                class="notification-button-primary-secondary" 
                style="
                  background: ${index === 0 ? '#2196f3' : 'none'}; 
                  color: ${index === 0 ? 'white' : '#2196f3'}; 
                  ${defaultButtonStyles}; 
                  ${buttonStyleObj.buttonStyle || ''}; 
                  ${buttonStyleObj.disableStyle || ''}" 
                  >
                ${button.title || `Button ${index + 1}`}
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}
