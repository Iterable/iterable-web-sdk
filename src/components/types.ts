import { ErrorHandler } from '../types';
import { IterableEmbeddedMessage } from '../embedded/types';

export type OutOfTheBoxElement = {
  id?: string;
  styles?: string;
};

export type OutOfTheBoxButton = OutOfTheBoxElement & {
  disabledStyles?: string;
};

export type OOTB = {
  appPackageName: string;
  message: IterableEmbeddedMessage;
  img?: OutOfTheBoxElement;
  title?: OutOfTheBoxElement;
  primaryButton?: OutOfTheBoxButton;
  secondaryButton?: OutOfTheBoxButton;
  body?: OutOfTheBoxElement;
  parent?: OutOfTheBoxElement;
  buttonsDiv?: OutOfTheBoxElement;
  textTitle?: OutOfTheBoxElement;
  textTitleImg?: OutOfTheBoxElement;
  errorCallback?: ErrorHandler;
};
