import React, { CSSProperties } from 'react';
import './style.css';

interface ICardProps {
  imgSrc?: string;
  title: string;
  text: string;
  primaryBtnLabel?: string;
  secondaryBtnLabel?: string;
  disablePrimaryBtn?: boolean;
  disableSecondaryBtn?: boolean;
  onClickPrimaryBtn?: () => void;
  onClickSecondaryBtn?: () => void;
  imgStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  cardStyle?: CSSProperties;
  textStyle?: CSSProperties;
  primaryBtnStyle?: CSSProperties;
  secondaryBtnStyle?: CSSProperties;
}

export const Card = (props: ICardProps) => {
  const {
    text,
    title,
    cardStyle,
    disablePrimaryBtn,
    disableSecondaryBtn,
    imgSrc,
    imgStyle,
    onClickPrimaryBtn,
    onClickSecondaryBtn,
    primaryBtnLabel,
    primaryBtnStyle,
    secondaryBtnLabel,
    secondaryBtnStyle,
    textStyle,
    titleStyle
  } = props;

  const defaultCardStyles = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: 'fit-content',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    padding: '16px'
  };
  const defaultImageStyles = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px'
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
  const defaultButtonStyles = {
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer'
  };

  return (
    <div className="card" style={{ ...defaultCardStyles, ...cardStyle }}>
      <img
        style={{ ...defaultImageStyles, ...imgStyle }}
        src={imgSrc ? imgSrc : '../../assets/iterable_logo.png'}
        alt={'logo'}
      />
      <div>
        <h3 style={{ ...defaultTitleStyles, ...titleStyle }}>{title}</h3>
        <p style={{ ...defaultTextStyles, ...textStyle }}>{text}</p>
      </div>
      <div className="card-buttons">
        {primaryBtnLabel ? (
          <button
            disabled={disablePrimaryBtn}
            style={
              disablePrimaryBtn
                ? {
                    ...defaultButtonStyles,
                    ...primaryBtnStyle,
                    color: 'grey'
                  }
                : { ...defaultButtonStyles, ...primaryBtnStyle }
            }
            onClick={onClickPrimaryBtn}
          >
            {primaryBtnLabel ? primaryBtnLabel : 'Button 1'}
          </button>
        ) : null}
        {secondaryBtnLabel ? (
          <button
            disabled={disableSecondaryBtn}
            style={
              disableSecondaryBtn
                ? {
                    ...defaultButtonStyles,
                    ...secondaryBtnStyle,
                    color: 'grey'
                  }
                : { ...defaultButtonStyles, ...secondaryBtnStyle }
            }
            onClick={onClickSecondaryBtn}
          >
            {secondaryBtnLabel ? secondaryBtnLabel : 'Button 2'}
          </button>
        ) : null}
      </div>
    </div>
  );
};
