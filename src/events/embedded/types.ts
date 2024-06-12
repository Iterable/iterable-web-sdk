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
  messageId: string;
  buttonIdentifier: string;
  createdAt: number;
  appPackageName?: string;
}

export interface IterableEmbeddedClickRequestPayload {
  messageId: string;
  buttonIdentifier: string;
  targetUrl: string;
  appPackageName: string;
}

export interface IterableEmbeddedSessionRequestPayload {
  session: IterableEmbeddedSession;
  impressions?: IterableEmbeddedImpression[];
  appPackageName: string;
}
