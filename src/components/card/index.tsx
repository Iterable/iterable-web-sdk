import React, { CSSProperties } from 'react';
import { TextParentStyles } from 'src/index';
import { EmbeddedMessageData } from '../types';
import { IterableActionRunner, IterableActionSource } from '../../embedded';

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

  const handleEmbeddedUrl = (type: string, data: string): boolean => {
    return new IterableActionRunner().executeAction(
      null,
      { type, data },
      IterableActionSource.EMBEDDED
    );
  };

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="card"
        style={{ ...defaultCardStyles, ...parentStyle }}
        onClick={() =>
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
            {messageData?.title || 'Title Here'}
          </text>
          <text
            className="titleText"
            style={{ ...defaultTextStyles, ...textStyle }}
          >
            {messageData?.body}
          </text>
        </div>
        <div style={cardButtons}>
          {messageData?.buttons?.map((button: any, index: number) => (
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
              onClick={() =>
                handleEmbeddedUrl(button?.action?.type, button?.action?.data)
              }
            >
              {button.title ? button.title : `Button ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
