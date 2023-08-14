import React, { CSSProperties } from 'react';

interface NotificationProps {
  title: string;
  description: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  primaryButtonStyle?: CSSProperties;
  secondaryButtonStyle?: CSSProperties;
  onClickPrimaryBtn?: () => void;
  onClickSecondaryBtn?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonStyle,
  secondaryButtonStyle,
  onClickPrimaryBtn,
  onClickSecondaryBtn
}) => {
  const cardStyle: CSSProperties = {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    border: '3px solid #caccd1'
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

  return (
    <div style={cardStyle}>
      <h2>{title}</h2>
      <p>{description}</p>
      {primaryButtonLabel && (
        <button
          onClick={onClickPrimaryBtn}
          style={{ ...primaryButtonDefaultStyle, ...primaryButtonStyle }}
        >
          {primaryButtonLabel}
        </button>
      )}
      {secondaryButtonLabel && (
        <button
          onClick={onClickSecondaryBtn}
          style={{ ...secondaryButtonDefaultStyle, ...secondaryButtonStyle }}
        >
          {secondaryButtonLabel}
        </button>
      )}
    </div>
  );
};

export default Notification;
