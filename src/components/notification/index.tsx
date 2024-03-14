import React, { CSSProperties } from 'react';
import { TextParentStyles } from 'src/index';

interface NotificationProps {
  title: string;
  description: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  primaryButtonStyle?: CSSProperties;
  secondaryButtonStyle?: CSSProperties;
  onClickPrimaryBtn?: () => void;
  onClickSecondaryBtn?: () => void;
  titleStyle?: CSSProperties;
  textStyle?: CSSProperties;
  primaryDisableBtnStyle?: CSSProperties;
  secondaryDisableBtnStyle?: CSSProperties;
  disablePrimaryBtn?: boolean;
  disableSecondaryBtn?: boolean;
  onClickView?: () => void;
}

/* Note: Add export to this const when support Embedded Message View Types in a later release. */
const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonStyle,
  secondaryButtonStyle,
  onClickPrimaryBtn,
  onClickSecondaryBtn,
  textStyle,
  titleStyle,
  primaryDisableBtnStyle,
  secondaryDisableBtnStyle,
  disablePrimaryBtn,
  disableSecondaryBtn,
  onClickView
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

  return (
    <>
      <style>{mediaStyle}</style>
      <div className="notification" style={cardStyle} onClick={onClickView}>
        <div style={{ ...defaultTextParentStyles }}>
          <text
            className="titleText"
            style={{ ...defaultTitleStyles, ...titleStyle }}
          >
            {title}
          </text>
          <text
            className="titleText"
            style={{ ...defaultTextStyles, ...textStyle }}
          >
            {description}
          </text>
        </div>
        <div style={notificationButtons}>
          <div style={notificationButtons}>
            {primaryButtonLabel && (
              <button
                onClick={onClickPrimaryBtn}
                disabled={disablePrimaryBtn}
                style={
                  disablePrimaryBtn
                    ? {
                        ...primaryButtonDefaultStyle,
                        ...primaryDisableBtnStyle
                      }
                    : { ...primaryButtonDefaultStyle, ...primaryButtonStyle }
                }
              >
                {primaryButtonLabel}
              </button>
            )}
            {secondaryButtonLabel && (
              <button
                onClick={onClickSecondaryBtn}
                disabled={disableSecondaryBtn}
                style={
                  disableSecondaryBtn
                    ? {
                        ...secondaryButtonDefaultStyle,
                        ...secondaryDisableBtnStyle
                      }
                    : {
                        ...secondaryButtonDefaultStyle,
                        ...secondaryButtonStyle
                      }
                }
              >
                {secondaryButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* Note: Remove this line when support Embedded Message View Types in a later release. */
console.log(Notification);
