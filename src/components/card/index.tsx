import { EmbeddedMessageData } from '../types';
import { EmbeddedManager } from '../../embedded';

export function Card({
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
  titleId = 'card-title',
  textId = 'card-text',
  primaryButtonId = 'card-primary-button',
  secondaryButtonId = 'card-secondary-button',
  parentId = 'card-parent',
  imageId = 'card-image'
}: EmbeddedMessageData): string {
  const defaultCardStyles = `
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    cursor: pointer;
  `;
  const defaultImageStyles = `
    width: 100%;
    height: auto;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `;
  const defaultTitleStyles = `
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
    display: block;
  `;
  const defaultTextStyles = `
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  `;
  const defaultButtonStyles = `
    max-width: calc(50% - 32px);
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    background-color: transparent;
    color: ${disablePrimaryBtn ? 'grey' : '#433d99'};
    border: none;
    border-radius: 0;
    cursor: pointer;
    padding: 5px;
    overflow-wrap: break-word;
  `;

  const defaultTextParentStyles = `
    overflow-wrap: break-word;
    margin: 10px;
  `;

  const cardButtons = `
    margin-top: auto;
    margin-left: 5px;
  `;

  const mediaStyle = `
    @media screen and (max-width: 800px) {
        .titleText {
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 2.6em;
          line-height: 1.3em;
        }
        .card {
          min-height: 350px;
          display: flex;
          flex-direction: column;
        }
      }
    `;

  const embeddedManager = new EmbeddedManager();
  const handleCardClick = () => {
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
    const notificationDiv = document.getElementById(parentId);
    const primaryButtonClick = document.getElementById(primaryButtonId);
    const secondaryButtonClick = document.getElementById(secondaryButtonId);
    if (notificationDiv) {
      notificationDiv.addEventListener('click', handleCardClick);
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
      class="card"
      id="${parentId}"
      style="${defaultCardStyles}; ${parentStyle || ''}" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img class="card" id="${imageId}" style="${defaultImageStyles}; ${
              imgStyle || ''
            }" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div class="card" style="${defaultTextParentStyles}">
        <text class="titleText card"  id="${titleId}" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
          ${message?.elements?.title || 'Title Here'}
        </text>
        <text class="titleText card" id="${textId}" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
          ${message?.elements?.body}
        </text>
      </div>
      <div class="card" style="${cardButtons}">
        ${message?.elements?.buttons
          ?.map((button: any, index: number) => {
            const buttonStyle =
              index === 0 ? primaryBtnStyle : secondaryBtnStyle;
            const disableStyle =
              index === 0 ? primaryDisableBtnStyle : secondaryDisableBtnStyle;
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
                id="${index === 0 ? primaryButtonId : secondaryButtonId}"
                class="card-button-primary-secondary" 
                style="
                  ${defaultButtonStyles}; 
                  ${
                    index === 0
                      ? disablePrimaryBtn
                        ? primaryDisableBtnStyle || ''
                        : primaryBtnStyle || ''
                      : disableSecondaryBtn
                      ? secondaryDisableBtnStyle || ''
                      : secondaryBtnStyle || ''
                  };
                  ${buttonStyle || ''}; 
                  ${disableStyle || ''}" 
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
