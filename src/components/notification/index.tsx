import { EmbeddedMessageData } from '../types';
import { EmbeddedManager } from '../../embedded';

export function Notification({
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
  parentId = 'notification-parent'
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
  const embeddedManager = new EmbeddedManager();
  function handleNotificationClick() {
    const clickedUrl =
      message?.elements?.defaultAction?.data?.trim() ||
      message?.elements?.defaultAction?.type ||
      null;
    embeddedManager.handleEmbeddedClick(message, null, clickedUrl);
    embeddedManager.trackEmbeddedClick(
      message,
      '',
      clickedUrl ? clickedUrl : ''
    );
  }

  function handleButtonClick(button: any) {
    const clickedUrl =
      button?.action?.data?.trim() || button?.action?.type || '';
    embeddedManager.handleEmbeddedClick(message, button?.id, clickedUrl);
    embeddedManager.trackEmbeddedClick(message, button?.id, clickedUrl);
  }

  function addButtonClickEvent(button: HTMLElement, index: number) {
    button.addEventListener('click', (event) => {
      // Prevent the click event from bubbling up to the div
      event.stopPropagation();
      if (!message?.elements?.buttons) {
        return '';
      }
      handleButtonClick(message?.elements?.buttons[index]);
    });
  }

  setTimeout(() => {
    const notificationDiv = document.getElementsByName(
      `${message?.metadata?.messageId}-notifiation`
    )[0];
    const primaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-notification-primaryButton`
    )[0];
    const secondaryButtonClick = document.getElementsByName(
      `${message?.metadata?.messageId}-notification-secondaryButton`
    )[0];
    if (notificationDiv) {
      notificationDiv.addEventListener('click', handleNotificationClick);
    }
    if (primaryButtonClick) {
      addButtonClickEvent(primaryButtonClick, 0);
    }
    if (secondaryButtonClick) {
      addButtonClickEvent(secondaryButtonClick, 1);
    }
  }, 0);

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
      <div class="notification" 
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
      <div class="notification" style="margin-top: auto;">
        ${message?.elements?.buttons
          ?.map((button: any, index: number) => {
            const buttonStyle =
              index === 0 ? primaryBtnStyle : secondaryBtnStyle;

            return `
              <button 
                key="${index}" 
                ${
                  index === 0
                    ? disablePrimaryBtn
                      ? 'disabled'
                      : 'enabled'
                    : disableSecondaryBtn
                    ? 'disabled'
                    : 'enabled'
                } 
                data-index="${index}"
                name="${message?.metadata?.messageId}${
              index === 0
                ? '-notification-primaryButton'
                : '-notification-secondaryButton'
            }"
                id="${index === 0 ? primaryButtonId : secondaryButtonId}"
                class="notification-button-primary-secondary" 
                style="
                  max-width: calc(50% - 32px); 
                  text-align: left; 
                  background: ${index === 0 ? '#2196f3' : 'none'}; 
                  color: ${index === 0 ? 'white' : '#2196f3'}; 
                  border-radius: 4px; 
                  padding: 8px; 
                  margin-right: 8px; 
                  cursor: pointer; 
                  border: none; 
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.06); 
                  overflow-wrap: break-word; 
                  ${buttonStyle || ''}; 
                  ${
                    index === 0
                      ? disablePrimaryBtn
                        ? primaryDisableBtnStyle || ''
                        : primaryBtnStyle || ''
                      : disableSecondaryBtn
                      ? secondaryDisableBtnStyle || ''
                      : secondaryBtnStyle || ''
                  }"
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
