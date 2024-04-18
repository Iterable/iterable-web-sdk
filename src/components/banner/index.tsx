import { EmbeddedMessageData } from '../types';
import { EmbeddedManager } from '../../embedded';

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
  imageId = 'banner-image'
}: EmbeddedMessageData): string {
  const defaultBannerStyles = `
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 16px;
    cursor: pointer;
  `;
  const defaultImageStyles = `
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin-left: 10px;
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
    overflow-wrap: break-word;
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
        min-height: 150px;
        display: flex;
        flex-direction: column;
      }
    }
  `;

  const embeddedManager = new EmbeddedManager();
  const handleBannerClick = () => {
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
      notificationDiv.addEventListener('click', handleBannerClick);
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
      class="banner" 
      id="${parentId}"
      style="${defaultBannerStyles}; ${parentStyle || ''}" 
    >
      <div class="banner" 
      style="display: flex; flex-direction: row;">
        <div class="banner" 
        style="${defaultTextParentStyles}">
          <text class="titleText banner"  id="${titleId}" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
            ${message?.elements?.title || 'Title Here'}
          </text>
          <text class="titleText banner" id="${textId}" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
            ${message?.elements?.body}
          </text>
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img class="banner" id="${imageId}"
            style="${defaultImageStyles}; ${imgStyle || ''}" src="${
                message?.elements?.mediaUrl
              }" />`
            : ''
        }
      </div>
      <div class="banner" 
       style="${bannerButtons}">
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
                class="banner-button-primary-secondary" 
                ${defaultTitleStyles}; ${titleStyle || ''}
                style="${defaultButtonStyles};  ${buttonStyle || ''} ${
              disableStyle || ''
            }"
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
