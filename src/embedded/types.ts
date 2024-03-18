export interface EmbeddedMessageUpdateHandler {
  onMessagesUpdated: () => void;
  onEmbeddedMessagingDisabled: () => void;
}

export interface IEmbeddedImpressionData {
  messageId: string;
  displayCount: number;
  duration: number;
  start?: Date;
}

export enum IterableActionSource {
  PUSH = 'PUSH',
  APP_LINK = 'APP_LINK',
  IN_APP = 'IN_APP',
  EMBEDDED = 'EMBEDDED'
}

export interface IterableAction {
  type: string;
  data: string;
}
export interface IterableActionContext {
  action: IterableAction;
  source: IterableActionSource;
}

export interface IterableUrlHandler {
  handleIterableURL(uri: string, actionContext: IterableActionContext): boolean;
}

export interface IterableCustomActionHandler {
  handleIterableCustomAction(
    action: IterableAction,
    actionContext: IterableActionContext
  ): boolean;
}
