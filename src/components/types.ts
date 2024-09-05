import { ErrorHandler } from '../types';
import { IterableEmbeddedMessage } from '../embedded/types';

export type OutOfTheBoxElement = {
  /** id of the element */
  id?: string;
  /** Stringified CSS to be passed to element "style" tag */
  styles?: string;
};

export type OutOfTheBoxButton = OutOfTheBoxElement & {
  /** Stringified CSS to be passed to element "style" tag.
   * Presence of this valude determines whether or not the button is in disabled.
   */
  disabledStyles?: string;
};

type Elements = {
  /** img div */
  img?: OutOfTheBoxElement;
  /** title div */
  title?: OutOfTheBoxElement;
  /** primary button div */
  primaryButton?: OutOfTheBoxButton;
  /** secondary button div */
  secondaryButton?: OutOfTheBoxButton;
  /** body button div */
  body?: OutOfTheBoxElement;
  /** root OOTB div */
  parent?: OutOfTheBoxElement;
  /** button wrapper div */
  buttonsDiv?: OutOfTheBoxElement;
  /** title and parent wrapper div */
  textTitle?: OutOfTheBoxElement;
  /** textTitleImg div */
  textTitleImg?: OutOfTheBoxElement;
};

export type OOTB = {
  appPackageName: string;
  message: IterableEmbeddedMessage;
  htmlElements?: Elements;
  /** callback method to handle button or element click errors */
  errorCallback?: ErrorHandler;
};
