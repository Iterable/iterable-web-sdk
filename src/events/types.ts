import { IEmbeddedMessageElements, IEmbeddedMessageMetadata } from '../types';
export interface IEmbeddedMessage {
  email?: string;
  userId?: string;
  messageId?: string;
  metadata: IEmbeddedMessageMetadata;
  elements?: IEmbeddedMessageElements;
  payload?: Array<any>;
}
