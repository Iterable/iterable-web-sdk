interface AnonSessionContext {
  totalAnonSessionCount?: number;
  lastAnonSession?: number;
  firstAnonSession?: number;
  webPushOptIn?: string;
  lastPage?: string;
  matchedCriteriaId: number;
}

export interface TrackAnonSessionParams {
  email?: string | null;
  userId?: string | null;
  createdAt: number;
  deviceInfo: {
    deviceId: string;
    appPackageName: string; // customer-defined name
    platform: string;
  };
  anonSessionContext: AnonSessionContext;
}
