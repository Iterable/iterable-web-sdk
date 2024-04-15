// import React, { CSSProperties } from 'react';
// import { EmbeddedManager } from '../../embedded';
// import { EmbeddedMessageData } from '../types';

// /* WARNING: OOTB Views not officially supported for Beta */
// export const Banner = (props: EmbeddedMessageData) => {
//   const {
//     parentStyle,
//     disablePrimaryBtn,
//     disableSecondaryBtn,
//     imgStyle,
//     primaryBtnStyle,
//     primaryDisableBtnStyle,
//     secondaryBtnStyle,
//     secondaryDisableBtnStyle,
//     textStyle,
//     titleStyle,
//     message
//   } = props;

//   const defaultBannerStyles = {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     margin: 'auto',
//     marginTop: '10px',
//     marginBottom: '10px',
//     padding: '16px',
//     cursor: 'pointer'
//   };
//   const defaultImageStyles = {
//     width: '70px',
//     height: '70px',
//     borderRadius: '8px',
//     marginLeft: 10
//   };
//   const defaultTitleStyles = {
//     fontSize: '20px',
//     fontWeight: 'bold',
//     marginBottom: '4px',
//     display: 'block'
//   };
//   const defaultTextStyles = {
//     fontSize: '16px',
//     marginBottom: '10px',
//     display: 'block'
//   };
//   const bannerButtons: CSSProperties = {
//     marginTop: 'auto'
//   };
//   const defaultButtonStyles: CSSProperties = {
//     maxWidth: 'calc(50% - 32px)',
//     textAlign: 'left',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     backgroundColor: 'transparent',
//     color: '#433d99',
//     border: 'none',
//     borderRadius: 0,
//     cursor: 'pointer',
//     padding: '5px',
//     overflowWrap: 'break-word'
//   };
//   const defaultTextParentStyles = {
//     flex: '1',
//     maxWidth: 'calc(100% - 80px)'
//   };
//   const mediaStyle = `
//   @media screen and (max-width: 800px) {
//       .titleText {
//         overflow: hidden;
//         text-overflow: ellipsis;
//         max-height: 2.6em;
//         line-height: 1.3em;
//       }
//       .banner {
//         min-height: 150px;
//         display: flex;
//         flex-direction: column;
//       }
//     }
//   `;

//   const embeddedManager = new EmbeddedManager();

//   return (
//     <>
//       <style>{mediaStyle}</style>
//       <div
//         className="banner"
//         style={{
//           ...defaultBannerStyles,
//           ...parentStyle
//         }}
//         onClick={() => {
//           const clickedUrl =
//             message?.elements?.defaultAction?.data?.trim() ||
//             message?.elements?.defaultAction?.type ||
//             null;
//           embeddedManager.handleEmbeddedClick(message, null, clickedUrl);
//           embeddedManager.trackEmbeddedClick(
//             message,
//             '',
//             clickedUrl ? clickedUrl : ''
//           );
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row'
//           }}
//         >
//           <div style={defaultTextParentStyles}>
//             <text
//               className="titleText"
//               style={{
//                 ...defaultTitleStyles,
//                 ...titleStyle
//               }}
//             >
//               {message?.elements?.title || 'Title Here'}
//             </text>
//             <text
//               className="titleText"
//               style={{ ...defaultTextStyles, ...textStyle }}
//             >
//               {message?.elements?.body}
//             </text>
//           </div>
//           {message?.elements?.mediaUrl && (
//             <img
//               style={{ ...defaultImageStyles, ...imgStyle }}
//               src={message?.elements?.mediaUrl}
//             />
//           )}
//         </div>
//         <div style={bannerButtons}>
//           {message?.elements?.buttons?.map((button: any, index: number) => (
//             <button
//               key={index}
//               disabled={index === 0 ? disablePrimaryBtn : disableSecondaryBtn}
//               style={
//                 index === 0
//                   ? disablePrimaryBtn
//                     ? { ...defaultButtonStyles, ...primaryDisableBtnStyle }
//                     : { ...defaultButtonStyles, ...primaryBtnStyle }
//                   : disableSecondaryBtn
//                   ? { ...defaultButtonStyles, ...secondaryDisableBtnStyle }
//                   : { ...defaultButtonStyles, ...secondaryBtnStyle }
//               }
//               onClick={() => {
//                 const clickedUrl =
//                   button?.action?.data?.trim() || button?.action?.type || '';
//                 embeddedManager.handleEmbeddedClick(
//                   message,
//                   button?.id,
//                   clickedUrl
//                 );
//                 embeddedManager.trackEmbeddedClick(
//                   message,
//                   button?.id,
//                   clickedUrl
//                 );
//               }}
//             >
//               {button.title ? button.title : `Button ${index + 1}`}
//             </button>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

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
  message
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
    console.log('vvvvvv0', message);
    console.log('vvvvvv1', message?.elements?.defaultAction?.data);
    console.log('vvvvvv2', message?.elements?.defaultAction?.type);
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
    console.log('vvvvvvv44444', event.target);
    const target = event.target as HTMLElement;
    if (target.classList.contains('banner')) {
      handleBannerClick();
    } else if (target.classList.contains('button-primary-secondary')) {
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
      class="banner" 
      style="${defaultBannerStyles}; ${parentStyle || ''}" 
    >
      <div style="display: flex; flex-direction: row;">
        <div style="${defaultTextParentStyles}">
          <text class="titleText" style="${defaultTitleStyles}; ${
    titleStyle || ''
  }">
            ${message?.elements?.title || 'Title Here'}
          </text>
          <text class="titleText" style="${defaultTextStyles}; ${
    textStyle || ''
  }">
            ${message?.elements?.body}
          </text>
        </div>
        ${
          message?.elements?.mediaUrl
            ? `<img style="${defaultImageStyles}; ${imgStyle || ''}" src="${
                message?.elements?.mediaUrl
              }" />`
            : ''
        }
      </div>
      <div style="${bannerButtons}">
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
                class="button-primary-secondary" 
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
