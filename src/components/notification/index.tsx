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

export const Notification: React.FC<NotificationProps> = ({
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
    background: '#2196f3',
    color: 'white',
    borderRadius: '4px',
    padding: '8px 16px',
    marginRight: '8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.06)'
  };

  const secondaryButtonDefaultStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#2196f3',
    cursor: 'pointer'
  };

  const defaultTitleStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const defaultTextStyles = {
    fontSize: '16px',
    marginBottom: '16px'
  };

  const defaultTextParentStyles: TextParentStyles = {
    overflowWrap: 'break-word',
    margin: '10px'
  };

  return (
    <div style={cardStyle} onClick={onClickView}>
      <div style={{ ...defaultTextParentStyles }}>
        <text
          style={{ ...defaultTitleStyles, ...titleStyle, display: 'block' }}
        >
          {title}
        </text>
        <text style={{ ...defaultTextStyles, ...textStyle, display: 'block' }}>
          {description}
        </text>
      </div>
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
              : { ...secondaryButtonDefaultStyle, ...secondaryButtonStyle }
          }
        >
          {secondaryButtonLabel}
        </button>
      )}
    </div>
  );
};
