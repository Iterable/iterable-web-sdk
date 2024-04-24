import { AxiosError, AxiosPromise } from 'axios';

/**
  make one property in an interface optional 
  @thanks https://stackoverflow.com/a/61108377/7455960
*/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type IterablePromise<T = any> = AxiosPromise<T>;

export type IterablePromiseRejection<T = any> = AxiosError<T>;

export type IterableErrorStatus =
  | 'Success'
  | 'BadApiKey'
  | 'BadParams'
  | 'BadJsonBody'
  | 'QueueEmailError'
  | 'GenericError'
  | 'InvalidEmailAddressError'
  | 'DatabaseError'
  | 'EmailAlreadyExists'
  | 'Forbidden'
  | 'JwtUserIdentifiersMismatched'
  | 'InvalidJwtPayload';

export type IterablePlatform = 'iOS' | 'Android' | 'Web';

/*
  potential response for both 200+ and 400+
*/
export interface IterableResponse {
  code: IterableErrorStatus;
  msg: string;
  params?: null | Record<string, any>;
}
export interface IEmbeddedMessageElementsButton {
  id: string;
  title: string;
  action?: IEmbeddedMessageElementsButtonAction;
}
export interface IEmbeddedMessageElementsButtonAction {
  type: string;
  data?: string;
}
export interface IEmbeddedMessageElements {
  title?: string;
  body?: string;
  mediaUrl?: string;

  buttons?: [IEmbeddedMessageElementsButton];
  text?: [IEmbeddedMessageElementsText];
  defaultAction?: IEmbeddedMessageElementsDefaultAction;
}
export interface IEmbeddedMessageElementsText {
  id: string;
  text?: string;
}
export interface IEmbeddedMessageElementsDefaultAction {
  type: string;
  data?: string;
}

export interface IEmbeddedMessageMetadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}
export interface IEmbeddedImpression {
  messageId: string;
  displayCount: number;
  duration: number;
  displayDuration?: number;
}

export interface IEmbeddedSession {
  start?: Date;
  end?: Date;
  placementId?: string;
  impressions?: Array<IEmbeddedImpression>;
  id: string;
}

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  appPackageName: string;
}

export interface EmbeddedMessagingDismiss {
  email?: string;
  userId?: string;
  messageId: string;
  buttonIdentifier: string;
  deviceInfo: DeviceInfo;
  createdAt: number;
}

export interface Session {
  id: string;
  start: number;
  end: number;
}

export interface Impression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: string;
}

export interface EmbeddedMessagingSession {
  userId?: string;
  email?: string;
  session: Session;
  impressions: Array<Impression>;
  deviceInfo: DeviceInfo;
  createdAt: number;
}
