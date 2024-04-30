interface Session {
  id: string;
  start?: number;
  end?: number;
}

interface Impression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
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
  placementId?: string;
  impressions?: Impression[];
  appPackageName?: string;
}
