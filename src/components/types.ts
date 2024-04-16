import { IterableEmbeddedMessage } from '..';

export interface EmbeddedMessageData {
  message: IterableEmbeddedMessage;
  disablePrimaryBtn?: boolean;
  disableSecondaryBtn?: boolean;
  imgStyle?: string;
  titleStyle?: string;
  parentStyle?: string;
  textStyle?: string;
  primaryBtnStyle?: string;
  primaryDisableBtnStyle?: string;
  secondaryBtnStyle?: string;
  secondaryDisableBtnStyle?: string;
}
