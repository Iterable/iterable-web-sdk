import { ErrorHandler, IterableEmbeddedMessage } from '..';

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
  titleId?: string;
  textId?: string;
  primaryButtonId?: string;
  secondaryButtonId?: string;
  parentId?: string;
  imageId?: string;
  buttonsDivId?: string;
  textTitleDivId?: string;
  textTitleImageDivId?: string;
  errorCallback?: ErrorHandler;
}
