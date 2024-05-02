export interface IterableEmbeddedButtonAction {
  type: string;
  data?: string;
}

export interface IterableEmbeddedElements {
  title?: string;
  body?: string;
  mediaUrl?: string;

  buttons?: IterableEmbeddedButton[];
  text?: IterableEmbeddedText[];
  defaultAction?: IterableEmbeddedDefaultAction;
}

export interface IterableEmbeddedText {
  id: string;
  text?: string;
}

export interface IterableEmbeddedDefaultAction {
  type: string;
  data?: string;
}

export interface IterableEmbeddedMetadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}

export interface IterableEmbeddedButton {
  id: string;
  title?: string;
  action?: IterableEmbeddedButtonAction;
}

export interface IterableEmbeddedMessage {
  metadata: IterableEmbeddedMetadata;
  elements?: IterableEmbeddedElements;
  payload?: Record<string, any>;
}

export interface IterableEmbeddedMessageUpdateHandler {
  onMessagesUpdated: () => void;
  onEmbeddedMessagingDisabled: () => void;
}

export enum IterableActionSource {
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
