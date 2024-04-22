import { CSSProperties } from 'react';
import { IterableEmbeddedMessage } from '..';

export interface EmbeddedMessageData {
  message: IterableEmbeddedMessage;
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
}
