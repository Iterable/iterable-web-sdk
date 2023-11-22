import React, { CSSProperties } from 'react';
import '../style.css';

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
    width: '30%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    paddingBottom: '10px'
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
    marginBottom: '10px'
  };
  const defaultTextStyles = {
    fontSize: '14px',
    marginBottom: '16px'
  };
  const defaultButtonStyles = {
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: disablePrimaryBtn ? 'grey' : '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer'
  };
  const defaultTextParentStyles = {
    margin: '10px'
  };

  return (
    <div className="card" style={{ ...defaultCardStyles, ...cardStyle }}>
      <img
        style={{ ...defaultImageStyles, ...imgStyle }}
        src={imgSrc ? imgSrc : '../../assets/iterable_logo.png'}
        alt={'logo'}
      />
      <div style={{ ...defaultTextParentStyles }}>
        <text style={{ ...defaultTitleStyles, ...titleStyle }}>{title}</text>
        <br></br>
        <text style={{ ...defaultTextStyles, ...textStyle }}>{text}</text>
      </div>
      <div className="card-buttons">
        {primaryBtnLabel ? (
          <button
            disabled={disablePrimaryBtn}
            style={{ ...defaultButtonStyles, ...primaryBtnStyle }}
            onClick={onClickPrimaryBtn}
          >
            {primaryBtnLabel ? primaryBtnLabel : 'Button 1'}
          </button>
        ) : null}
        {secondaryBtnLabel ? (
          <button
            disabled={disableSecondaryBtn}
            style={{ ...defaultButtonStyles, ...secondaryBtnStyle }}
            onClick={onClickSecondaryBtn}
          >
            {secondaryBtnLabel ? secondaryBtnLabel : 'Button 2'}
          </button>
        ) : null}
      </div>
    </div>
  );
};
