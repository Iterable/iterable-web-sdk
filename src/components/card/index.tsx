import React, { CSSProperties } from 'react';
import { TextParentStyles } from 'src/index';

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
  primaryDisableBtnStyle?: CSSProperties;
  secondaryBtnStyle?: CSSProperties;
  secondaryDisableBtnStyle?: CSSProperties;
  onClickView?: () => void;
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
    primaryDisableBtnStyle,
    secondaryBtnLabel,
    secondaryBtnStyle,
    secondaryDisableBtnStyle,
    textStyle,
    titleStyle,
    onClickView
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
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: disablePrimaryBtn ? 'grey' : '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    padding: '5px'
  };

  const defaultTextParentStyles: TextParentStyles = {
    overflowWrap: 'break-word',
    margin: '10px'
  };

  const cardButtons = {
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
        height: 450px;
        display: flex;
        flex-direction: column;
      }
    }
  `;

  return (
    <>
      <style>{mediaStyle}</style>
      <div
        className="card"
        style={{ ...defaultCardStyles, ...cardStyle }}
        onClick={onClickView}
      >
        {imgSrc && (
          <img style={{ ...defaultImageStyles, ...imgStyle }} src={imgSrc} />
        )}
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
            {text}
          </text>
        </div>
        <div style={cardButtons}>
          {primaryBtnLabel ? (
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
                      ...secondaryDisableBtnStyle
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
    </>
  );
};
