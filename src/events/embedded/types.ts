interface Session {
  id: string;
  start?: number;
  end?: number;
}

interface Impression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: number;
}

interface ButtonAction {
  type: string;
  data?: string;
}

interface Button {
  id: string;
  title: string;
  action?: ButtonAction;
}

interface Elements {
  title?: string;
  body?: string;
  mediaUrl?: string;

  buttons?: Button[];
  text?: Text[];
  defaultAction?: DefaultAction;
}

interface Text {
  id: string;
  text?: string;
}

interface DefaultAction {
  type: string;
  data?: string;
}

interface Metadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}

export interface EmbeddedMessage {
  email?: string;
  userId?: string;
  messageId: string;
  metadata: Metadata;
  elements?: Elements;
  payload?: Array<any>;
}

export interface EmbeddedDismissRequestPayload {
  email?: string;
  userId?: string;
  messageId: string;
  buttonIdentifier: string;
  createdAt: number;
  appPackageName?: string;
}

export interface EmbeddedClickRequestPayload {
  messageId: string;
  buttonIdentifier: string;
  clickedUrl: string;
  appPackageName?: string;
}

export interface EmbeddedSessionRequestPayload {
  session: Session;
  impressions?: Impression[];
  appPackageName?: string;
}
