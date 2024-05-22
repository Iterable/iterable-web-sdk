export interface IterableEmbeddedSession {
  id: string;
  start?: number;
  end?: number;
}

export interface IterableEmbeddedImpression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: number;
}

export interface IterableEmbeddedDismissRequestPayload {
  email?: string;
  userId?: string;
  messageId: string;
  buttonIdentifier: string;
  createdAt: number;
  appPackageName?: string;
}

export interface IterableEmbeddedClickRequestPayload {
  messageId: string;
  buttonIdentifier: string;
  clickedUrl: string;
  appPackageName: string;
}

export interface IterableEmbeddedSessionRequestPayload {
  session: IterableEmbeddedSession;
  impressions?: IterableEmbeddedImpression[];
  appPackageName: string;
}
