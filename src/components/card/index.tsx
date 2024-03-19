import React, { CSSProperties } from 'react';
import { TextParentStyles } from 'src/index';
import { EmbeddedMessageData } from '../types';
import { EmbeddedManager } from '../../embedded';

/* Note: Add export to this const when support Embedded Message View Types in a later release. */
const Card = (props: EmbeddedMessageData) => {
  const {
    parentStyle,
    disablePrimaryBtn,
    disableSecondaryBtn,
    imgStyle,
    primaryBtnStyle,
    primaryDisableBtnStyle,
    secondaryBtnStyle,
    secondaryDisableBtnStyle,
    textStyle,
    titleStyle,
    message
  } = props;

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
  const defaultTitleStyles = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block'
  };
  const defaultTextStyles = {
    fontSize: '14px',
    marginBottom: '10px',
    display: 'block'
  };
  const defaultButtonStyles: CSSProperties = {
    maxWidth: 'calc(50% - 32px)',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: disablePrimaryBtn ? 'grey' : '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    padding: '5px',
    overflowWrap: 'break-word'
  };

  const defaultTextParentStyles: TextParentStyles = {
    overflowWrap: 'break-word',
    margin: '10px'
  };

  const cardButtons: CSSProperties = {
    marginTop: 'auto',
    marginLeft: '5px'
  };

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

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="card"
        style={{ ...defaultCardStyles, ...parentStyle }}
        onClick={() => {
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
        }}
      >
        {message?.elements?.mediaUrl && (
          <img
            style={{ ...defaultImageStyles, ...imgStyle }}
            src={message?.elements?.mediaUrl}
          />
        )}
        <div style={{ ...defaultTextParentStyles }}>
          <text
            className="titleText"
            style={{ ...defaultTitleStyles, ...titleStyle }}
          >
            {message?.elements?.title || 'Title Here'}
          </text>
          <text
            className="titleText"
            style={{ ...defaultTextStyles, ...textStyle }}
          >
            {message?.elements?.body}
          </text>
        </div>
        <div style={cardButtons}>
          {message?.elements?.buttons?.map((button: any, index: number) => (
            <button
              key={index}
              disabled={index === 0 ? disablePrimaryBtn : disableSecondaryBtn}
              style={
                index === 0
                  ? disablePrimaryBtn
                    ? { ...defaultButtonStyles, ...primaryDisableBtnStyle }
                    : { ...defaultButtonStyles, ...primaryBtnStyle }
                  : disableSecondaryBtn
                  ? { ...defaultButtonStyles, ...secondaryDisableBtnStyle }
                  : { ...defaultButtonStyles, ...secondaryBtnStyle }
              }
              onClick={() => {
                const clickedUrl =
                  button?.action?.data?.trim() || button?.action?.type || '';
                embeddedManager.handleEmbeddedClick(
                  message,
                  button?.id,
                  clickedUrl
                );
                embeddedManager.trackEmbeddedClick(
                  message,
                  button?.id,
                  clickedUrl
                );
              }}
            >
              {button.title ? button.title : `Button ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/* Note: Remove this line when support Embedded Message View Types in a later release. */
console.log(Card);
