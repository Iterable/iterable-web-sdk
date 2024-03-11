import React, { CSSProperties } from 'react';
import {
  IterableActionRunner,
  IterableActionSource,
  TextParentStyles
} from 'src/index';
import { EmbeddedMessageData } from '../types';

export const Card = (props: EmbeddedMessageData) => {
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

  const iterableActionRunner = new IterableActionRunner();

  const handleEmbeddedUrl = (clickedUrl: string, data: string) => {
    const iterableAction = {
      type: clickedUrl,
      data
    };

    iterableActionRunner.executeAction(
      null,
      iterableAction,
      IterableActionSource.EMBEDDED
    );
  };

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="card"
        style={{ ...defaultCardStyles, ...parentStyle }}
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
        {messageData?.mediaUrl && (
          <img
            style={{ ...defaultImageStyles, ...imgStyle }}
            src={messageData?.mediaUrl}
          />
        )}
        <div style={{ ...defaultTextParentStyles }}>
          <text
            className="titleText"
            style={{ ...defaultTitleStyles, ...titleStyle }}
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
        <div style={cardButtons}>
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
              {messageData?.buttons?.[0]?.title
                ? messageData?.buttons?.[0]?.title
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
