import React, { CSSProperties } from "react";
import logo from "../../assets/iterable_logo.png";

interface CardProps {
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

const Card = (props: CardProps) => {
  const isPrimaryBtnDisabled = props.disablePrimaryBtn || false;
  const isSecondaryBtnDisabled = props.disableSecondaryBtn || false;

  const defaultCardStyles = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "fit-content",
    margin: "auto",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "16px",
  };
  const defaultImageStyles = {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  };
  const defaultTitleStyles = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "8px",
  };
  const defaultTextStyles = {
    fontSize: "16px",
    marginBottom: "16px",
  };
  const defaultButtonStyles = {
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "#433d99",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
  };
  return (
    <div className="card" style={{ ...defaultCardStyles, ...props.cardStyle }}>
      <img
        style={{ ...defaultImageStyles, ...props.imgStyle }}
        src={props.imgSrc ? props.imgSrc : logo}
        alt={"logo"}
      />
      <div>
        <h3 style={{ ...defaultTitleStyles, ...props.titleStyle }}>
          {props.title}
        </h3>
        <p style={{ ...defaultTextStyles, ...props.textStyle }}>{props.text}</p>
      </div>
      <div className="card-buttons">
        {props.primaryBtnLabel ? (
          <button
            disabled={isPrimaryBtnDisabled}
            style={
              isPrimaryBtnDisabled
                ? {
                    ...defaultButtonStyles,
                    ...props.primaryBtnStyle,
                    color: "grey",
                  }
                : { ...defaultButtonStyles, ...props.primaryBtnStyle }
            }
            onClick={props.onClickPrimaryBtn}
          >
            {props.primaryBtnLabel ? props.primaryBtnLabel : "Button 1"}
          </button>
        ) : null}
        {props.secondaryBtnLabel ? (
          <button
            disabled={isSecondaryBtnDisabled}
            style={
              isSecondaryBtnDisabled
                ? {
                    ...defaultButtonStyles,
                    ...props.secondaryBtnStyle,
                    color: "grey",
                  }
                : { ...defaultButtonStyles, ...props.secondaryBtnStyle }
            }
            onClick={props.onClickSecondaryBtn}
          >
            {props.secondaryBtnLabel ? props.secondaryBtnLabel : "Button 2"}
          </button>
        ) : null}
      </div>

      <style>
        {`@media (max-width: 768px) {
            .card {
              max-width: 90%;
            }
          }
          .card-buttons {
            display: flex;
            margin-top: 40px;
            margin-bottom: 10px;
            margin-right: 50px;
          }`}
      </style>
    </div>
  );
};

export default Card;
