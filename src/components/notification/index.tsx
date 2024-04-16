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
  titleStyle
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
  const handleNotificationClick = () => {
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
  };

  const handleButtonClick = (button: any) => {
    const clickedUrl =
      button?.action?.data?.trim() || button?.action?.type || '';
    embeddedManager.handleEmbeddedClick(message, button?.id, clickedUrl);
    embeddedManager.trackEmbeddedClick(message, button?.id, clickedUrl);
  };

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('notification')) {
      handleNotificationClick();
    } else if (
      target.classList.contains('notification-button-primary-secondary')
    ) {
      const index = parseInt(target.getAttribute('data-index') || '0', 10);
      if (!message || !message.elements || !message.elements.buttons) {
        return '';
      }
      handleButtonClick(message?.elements?.buttons[index]);
    }
  });

  return `
    <style>${mediaStyle}</style>
    <div 
      class="notification" 
      style="background: white; border-radius: 10px; padding: 20px; border: 3px solid #caccd1; margin-bottom: 10px; cursor: pointer;" 
    >
      <div class="notification" 
       style="${defaultTextParentStyles}">
        <p class="titleText notification" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
          ${message?.elements?.title || 'Title Here'}
        </p>
        <p class="titleText notification" style="${defaultTextStyles}; ${
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
