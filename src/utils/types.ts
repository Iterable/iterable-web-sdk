import { UpdateAnonymousUserParams } from '..';

interface AnonSessionContext {
  totalAnonSessionCount?: number;
  lastAnonSession?: number;
  firstAnonSession?: number;
  webPushOptIn?: string;
  lastPage?: string;
  matchedCriteriaId: number;
}

export interface TrackAnonSessionParams {
  user: UpdateAnonymousUserParams;
  createdAt: number;
  deviceInfo: {
    deviceId: string;
    appPackageName: string; // customer-defined name
    platform: string;
  };
  anonSessionContext: AnonSessionContext;
}
