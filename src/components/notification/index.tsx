import { EmbeddedMessageData } from '../types';
import { EmbeddedMessageElementsButton } from '../../embedded';
import {
  handleElementClick,
  addButtonClickEvent
} from '../../embedded/embeddedClickEvents';

export function Notification({
  parentStyle,
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
  const defaultNotificationStyles = `
  background: white;
  border-radius: 10px;
  padding: 10px 20px 15px 20px;
  border: 3px solid #caccd1;
  margin-bottom: 10px;
  cursor: ${message?.elements?.defaultAction ? 'pointer' : 'auto'};
  `;
  const defaultTitleStyles = `
    margin-top: 0px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
    color: rgb(61, 58, 59);
    display: block;
  `;
  const defaultTextStyles = `
    margin-top: 0.2em;
    font-size: 17px;
    margin-bottom: 10px;
    display: block;
    color: rgb(120, 113, 116);
  `;
  const defaultTextParentStyles = `
    overflow-wrap: break-word;
  `;
  const defaultButtonStyles = `
    max-width: calc(50% - 32px); 
    text-align: left; 
    font-weight: bold;
    border-radius: 100px;
    padding: 8px 0px;
    margin-right: 12px; 
    cursor: pointer; 
    border: none; 
    min-width: fit-content;
    font-size: 16px;
    color: #622a6a;
    background: none;
  `;
  const notificationButtons = `
    margin-top: auto;
    display:flex;
    flex-direction:row;
    flex-wrap: wrap;
    row-gap: 0.3em;
  `;
  const mediaStyle = `
    @media screen and (max-width: 800px) {
      .titleText {
        line-height: 1.3em;
      }
      .notification {
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
        handleElementClick(message)
      );
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
      class="notification" 
      id="${parentId}"
      name="${message?.metadata?.messageId}-notification"
      style="${defaultNotificationStyles}; ${parentStyle || ''}" 
    >
      <div id="${textTitleDivId}"
       style="${defaultTextParentStyles}">
        <p class="titleText" id="${titleId}" 
        style="${defaultTitleStyles}; ${titleStyle || ''}">
          ${message?.elements?.title || 'Title Here'}
        </p>
        <p class="titleText" id="${textId}" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
          ${message?.elements?.body}
        </p>
      </div>
      <div id="${buttonsDivId}" style="${notificationButtons}">
        ${message?.elements?.buttons
          ?.map((button: EmbeddedMessageElementsButton, index: number) => {
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
                  ${defaultButtonStyles}; 
                  ${
                    index === 0
                      ? 'background: #622a6a; color: white; padding: 8px 12px;'
                      : ''
                  }
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
