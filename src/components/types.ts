import { CSSProperties } from 'react';

export interface EmbeddedMessageData {
  messageData: Record<string, any>;
  disablePrimaryBtn?: boolean;
  disableSecondaryBtn?: boolean;
  imgStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  parentStyle?: CSSProperties;
  textStyle?: CSSProperties;
  primaryBtnStyle?: CSSProperties;
  primaryDisableBtnStyle?: CSSProperties;
  secondaryBtnStyle?: CSSProperties;
  secondaryDisableBtnStyle?: CSSProperties;
  handleEmbeddedClick?: () => void;
}
