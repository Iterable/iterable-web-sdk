import React, { CSSProperties } from 'react';
interface IBannerProps {
  heading: string;
  body: string;
  buttonText: string;
  logo: string;
  buttonStyles?: CSSProperties;
  bannerStyles?: CSSProperties;
  logoStyles?: CSSProperties;
  headingStyles?: CSSProperties;
  bodyStyles?: CSSProperties;
  buttonClickHandler?: Function;
}

const Banner = (props: IBannerProps) => {
  const {
    heading,
    body,
    buttonText,
    logo,
    bannerStyles,
    buttonStyles,
    logoStyles,
    headingStyles,
    bodyStyles,
    buttonClickHandler
  } = props;

  const defaultBannerStyles = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '20px',
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
  };
  const defaultHeadingStyles = {
    fontSize: '25px',
    marginBottom: '20px',
    marginRight: '20px'
  };
  const defaultBodyStyles = {
    fontSize: '16px',
    marginBottom: '20px',
    marginRight: '20px'
  };
  const defaultButtonStyles = {
    backgroundColor: '#6c016cf5',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    marginBottom: '20px'
  };
  const defaultLogoStyles = {
    width: '100%',
    height: 'auto'
  };

  return (
    <div
      className="banner-container"
      style={{ ...defaultBannerStyles, ...bannerStyles }}
    >
      <div className="content-container ">
        <h2 style={{ ...defaultHeadingStyles, ...headingStyles }}>{heading}</h2>
        <p style={{ ...defaultBodyStyles, ...bodyStyles }}>{body}</p>
        <button
          style={{ ...defaultButtonStyles, ...buttonStyles }}
          onClick={
            buttonClickHandler as React.MouseEventHandler<HTMLButtonElement>
          }
        >
          {buttonText}
        </button>
      </div>
      <div style={{ marginRight: '20px' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ ...defaultLogoStyles, ...logoStyles }}
        />
      </div>
    </div>
  );
};

export default Banner;
