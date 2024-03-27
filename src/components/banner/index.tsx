import React, { CSSProperties } from 'react';
import { EmbeddedManager } from '../../embedded';
import { EmbeddedMessageData } from '../types';

/* WARNING: OOTB Views not officially supported for Beta */
export const Banner = (props: EmbeddedMessageData) => {
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

  const defaultBannerStyles = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    padding: '16px',
    cursor: 'pointer'
  };
  const defaultImageStyles = {
    width: '70px',
    height: '70px',
    borderRadius: '8px',
    marginLeft: 10
  };
  const defaultTitleStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block'
  };
  const defaultTextStyles = {
    fontSize: '16px',
    marginBottom: '10px',
    display: 'block'
  };
  const bannerButtons: CSSProperties = {
    marginTop: 'auto'
  };
  const defaultButtonStyles: CSSProperties = {
    maxWidth: 'calc(50% - 32px)',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    padding: '5px',
    overflowWrap: 'break-word'
  };
  const defaultTextParentStyles = {
    flex: '1',
    maxWidth: 'calc(100% - 80px)'
  };
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

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="banner"
        style={{
          ...defaultBannerStyles,
          ...parentStyle
        }}
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <div style={defaultTextParentStyles}>
            <text
              className="titleText"
              style={{
                ...defaultTitleStyles,
                ...titleStyle
              }}
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
          {message?.elements?.mediaUrl && (
            <img
              style={{ ...defaultImageStyles, ...imgStyle }}
              src={message?.elements?.mediaUrl}
            />
          )}
        </div>
        <div style={bannerButtons}>
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
