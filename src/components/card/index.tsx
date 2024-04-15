// import React, { CSSProperties } from 'react';
// import { TextParentStyles } from 'src/index';
// import { EmbeddedMessageData } from '../types';
// import { EmbeddedManager } from '../../embedded';

// /* WARNING: OOTB Views not officially supported for Beta */
// export const Card = (props: EmbeddedMessageData) => {
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

//   const defaultCardStyles = {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     margin: 'auto',
//     marginTop: '10px',
//     marginBottom: '10px',
//     paddingBottom: '10px',
//     cursor: 'pointer'
//   };
//   const defaultImageStyles = {
//     width: '100%',
//     height: 'auto',
//     borderTopLeftRadius: '8px',
//     borderTopRightRadius: '8px'
//   };
//   const defaultTitleStyles = {
//     fontSize: '18px',
//     fontWeight: 'bold',
//     marginBottom: '4px',
//     display: 'block'
//   };
//   const defaultTextStyles = {
//     fontSize: '14px',
//     marginBottom: '10px',
//     display: 'block'
//   };
//   const defaultButtonStyles: CSSProperties = {
//     maxWidth: 'calc(50% - 32px)',
//     textAlign: 'left',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     backgroundColor: 'transparent',
//     color: disablePrimaryBtn ? 'grey' : '#433d99',
//     border: 'none',
//     borderRadius: 0,
//     cursor: 'pointer',
//     padding: '5px',
//     overflowWrap: 'break-word'
//   };

//   const defaultTextParentStyles: TextParentStyles = {
//     overflowWrap: 'break-word',
//     margin: '10px'
//   };

//   const cardButtons: CSSProperties = {
//     marginTop: 'auto',
//     marginLeft: '5px'
//   };

//   const mediaStyle = `
//   @media screen and (max-width: 800px) {
//       .titleText {
//         overflow: hidden;
//         text-overflow: ellipsis;
//         max-height: 2.6em;
//         line-height: 1.3em;
//       }
//       .card {
//         min-height: 350px;
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
//         className="card"
//         style={{ ...defaultCardStyles, ...parentStyle }}
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
//         {message?.elements?.mediaUrl && (
//           <img
//             style={{ ...defaultImageStyles, ...imgStyle }}
//             src={message?.elements?.mediaUrl}
//           />
//         )}
//         <div style={{ ...defaultTextParentStyles }}>
//           <text
//             className="titleText"
//             style={{ ...defaultTitleStyles, ...titleStyle }}
//           >
//             {message?.elements?.title || 'Title Here'}
//           </text>
//           <text
//             className="titleText"
//             style={{ ...defaultTextStyles, ...textStyle }}
//           >
//             {message?.elements?.body}
//           </text>
//         </div>
//         <div style={cardButtons}>
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
  const defaultCardStyles = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    paddingBottom: '10px',
    cursor: 'pointer'
  };
  const defaultImageStyles = {
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  };
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
    if (target.classList.contains('card')) {
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
      class="card"
      style="${Object.entries({
        ...defaultCardStyles,
        ...parentStyle
      })
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')}"
    >
      ${
        message?.elements?.mediaUrl
          ? `<img style="${Object.entries({
              ...defaultImageStyles,
              ...imgStyle
            })
              .map(([key, value]) => `${key}: ${value};`)
              .join(' ')}" src="${message?.elements?.mediaUrl}" />`
          : ''
      }
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
      <div style="${cardButtons}">
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
