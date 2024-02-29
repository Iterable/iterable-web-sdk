import React, { CSSProperties } from 'react';

interface IBannerProps {
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
  BannerStyle?: CSSProperties;
  textStyle?: CSSProperties;
  primaryBtnStyle?: CSSProperties;
  primaryDisableBtnStyle?: CSSProperties;
  secondaryBtnStyle?: CSSProperties;
  secondaryDisableBtnStyle?: CSSProperties;
  onClickView?: () => void;
}

export const Banner = (props: IBannerProps) => {
  const {
    text,
    title,
    BannerStyle,
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
    marginBottom: '4px'
  };
  const defaultTextStyles = {
    fontSize: '16px',
    marginBottom: '10px'
  };
  const bannerButtons = {
    marginTop: 'auto'
  };
  const defaultButtonStyles: CSSProperties = {
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#433d99',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer'
  };
  const defaultTextParentStyles = {
    flex: '1',
    maxWidth: 'calc(100% - 80px)'
  };

  return (
    <>
      <style>
        {`
        @media screen and (max-width: 800px) {
            .titleText {
              overflow: hidden;
              text-overflow: ellipsis;
              max-height: 2.6em;
              line-height: 1.3em;
            }
            .banner {
              height: 250px;
              display: flex;
              flex-direction: column;
            }
          }
        `}
      </style>
      <div
        className="banner"
        style={{
          ...defaultBannerStyles,
          ...BannerStyle
        }}
        onClick={onClickView}
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
                ...titleStyle,
                display: 'block'
              }}
            >
              {title}
            </text>
            <text
              className="titleText"
              style={{ ...defaultTextStyles, ...textStyle, display: 'block' }}
            >
              {text}
            </text>
          </div>
          {imgSrc && (
            <img style={{ ...defaultImageStyles, ...imgStyle }} src={imgSrc} />
          )}
        </div>
        <div style={bannerButtons}>
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
