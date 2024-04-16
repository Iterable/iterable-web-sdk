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
  message
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

  const handleButtonClick = (button: any, index: number) => {
    const clickedUrl =
      button?.action?.data?.trim() || button?.action?.type || '';
    embeddedManager.handleEmbeddedClick(message, button?.id, clickedUrl);
    embeddedManager.trackEmbeddedClick(message, button?.id, clickedUrl);
  };

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('card')) {
      handleCardClick();
    } else if (target.classList.contains('card-button-primary-secondary')) {
      const index = parseInt(target.getAttribute('data-index') || '0', 10);
      if (!message || !message.elements || !message.elements.buttons) {
        return '';
      }
      handleButtonClick(message?.elements?.buttons[index], index);
    }
  });

  return `
    <style>${mediaStyle}</style>
    <div 
      class="card"
      style="${defaultCardStyles}; ${parentStyle || ''}" 
    >
      ${
        message?.elements?.mediaUrl
          ? `<img class="card" style="${defaultImageStyles}; ${imgStyle || ''}" 
          src="${message?.elements?.mediaUrl}"/>`
          : ''
      }
      <div class="card" style="${defaultTextParentStyles}">
        <text class="titleText card" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
          ${message?.elements?.title || 'Title Here'}
        </text>
        <text class="titleText card" style="${defaultTextStyles}; ${
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
