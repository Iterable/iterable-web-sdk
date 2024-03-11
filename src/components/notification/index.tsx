import React, { CSSProperties } from 'react';
import {
  IterableActionRunner,
  IterableActionSource,
  TextParentStyles
} from 'src/index';
import { EmbeddedMessageData } from '../types';

export const Notification: React.FC<EmbeddedMessageData> = ({
  primaryBtnStyle,
  secondaryBtnStyle,
  textStyle,
  titleStyle,
  primaryDisableBtnStyle,
  secondaryDisableBtnStyle,
  disablePrimaryBtn,
  disableSecondaryBtn,
  handleEmbeddedClick,
  messageData
}) => {
  const cardStyle: CSSProperties = {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    border: '3px solid #caccd1',
    marginBottom: '10px',
    cursor: 'pointer'
  };

  const primaryButtonDefaultStyle: CSSProperties = {
    maxWidth: 'calc(50% - 32px)',
    textAlign: 'left',
    background: '#2196f3',
    color: 'white',
    borderRadius: '4px',
    padding: '8px',
    marginRight: '8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.06)',
    overflowWrap: 'break-word'
  };

  const secondaryButtonDefaultStyle: CSSProperties = {
    maxWidth: 'calc(50% - 32px)',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: '#2196f3',
    cursor: 'pointer',
    padding: '5px',
    overflowWrap: 'break-word'
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

  const defaultTextParentStyles: TextParentStyles = {
    overflowWrap: 'break-word'
  };

  const notificationButtons: CSSProperties = {
    marginTop: 'auto'
  };

  const mediaStyle = `
  @media screen and (max-width: 800px) {
      .titleText {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 2.6em;
        line-height: 1.3em;
      }
      .notification {
        min-height: 100px;
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
        className="notification"
        style={cardStyle}
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
        <div style={notificationButtons}>
          <div style={notificationButtons}>
            {messageData?.buttons?.[0].title && (
              <button
                onClick={() =>
                  handleEmbeddedUrl(
                    messageData?.buttons?.[0]?.action?.type,
                    messageData?.buttons?.[0]?.action?.data
                  )
                }
                disabled={disablePrimaryBtn}
                style={
                  disablePrimaryBtn
                    ? {
                        ...primaryButtonDefaultStyle,
                        ...primaryDisableBtnStyle
                      }
                    : { ...primaryButtonDefaultStyle, ...primaryBtnStyle }
                }
              >
                {messageData?.buttons?.[0].title}
              </button>
            )}
            {messageData?.buttons?.[1]?.title && (
              <button
                onClick={() =>
                  handleEmbeddedUrl(
                    messageData?.buttons?.[1]?.action?.type,
                    messageData?.buttons?.[1]?.action?.data
                  )
                }
                disabled={disableSecondaryBtn}
                style={
                  disableSecondaryBtn
                    ? {
                        ...secondaryButtonDefaultStyle,
                        ...secondaryDisableBtnStyle
                      }
                    : {
                        ...secondaryButtonDefaultStyle,
                        ...secondaryBtnStyle
                      }
                }
              >
                {messageData?.buttons?.[1]?.title}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
