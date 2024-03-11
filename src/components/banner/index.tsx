import React, { CSSProperties } from 'react';
import { EmbeddedMessageData } from '../types';
import { IterableActionRunner, IterableActionSource } from '../../embedded';

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
    handleEmbeddedClick,
    messageData
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

  const handleEmbeddedUrl = (type: string, data: string) => {
    new IterableActionRunner().executeAction(
      null,
      { type, data },
      IterableActionSource.EMBEDDED
    );
  };

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="banner"
        style={{
          ...defaultBannerStyles,
          ...parentStyle
        }}
        onClick={
          handleEmbeddedClick
            ? handleEmbeddedClick
            : () =>
                handleEmbeddedUrl(
                  messageData?.defaultAction?.type,
                  messageData?.defaultAction?.data
                )
        }
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
              {messageData?.title}
            </text>
            <text
              className="titleText"
              style={{ ...defaultTextStyles, ...textStyle }}
            >
              {messageData?.body}
            </text>
          </div>
          {messageData?.mediaUrl && (
            <img
              style={{ ...defaultImageStyles, ...imgStyle }}
              src={messageData?.mediaUrl}
            />
          )}
        </div>
        <div style={bannerButtons}>
          {messageData?.buttons?.[0].title ? (
            <button
              disabled={disablePrimaryBtn}
              style={
                disablePrimaryBtn
                  ? {
                      ...defaultButtonStyles,
                      ...primaryDisableBtnStyle
                    }
                  : { ...defaultButtonStyles, ...primaryBtnStyle }
              }
              onClick={() =>
                handleEmbeddedUrl(
                  messageData?.buttons?.[0]?.action?.type,
                  messageData?.buttons?.[0]?.action?.data
                )
              }
            >
              {messageData?.buttons?.[0].title
                ? messageData?.buttons?.[0].title
                : 'Button 1'}
            </button>
          ) : null}
          {messageData?.buttons?.[1]?.title ? (
            <button
              disabled={disableSecondaryBtn}
              style={
                disableSecondaryBtn
                  ? {
                      ...defaultButtonStyles,
                      ...secondaryDisableBtnStyle
                    }
                  : { ...defaultButtonStyles, ...secondaryBtnStyle }
              }
              onClick={() =>
                handleEmbeddedUrl(
                  messageData?.buttons?.[1]?.action?.type,
                  messageData?.buttons?.[1]?.action?.data
                )
              }
            >
              {messageData?.buttons?.[1]?.title
                ? messageData?.buttons?.[1]?.title
                : 'Button 2'}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
