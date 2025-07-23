import { UpdateUnknownUserParams } from '../users/types';

interface UnknownSessionContext {
  totalAnonSessionCount?: number;
  lastAnonSession?: number;
  firstAnonSession?: number;
  webPushOptIn?: string;
  lastPage?: string;
  matchedCriteriaId: number;
}

export interface TrackUnknownSessionParams {
  user: UpdateUnknownUserParams;
  createdAt: number;
  deviceInfo: {
    deviceId: string;
    appPackageName: string; // customer-defined name
    platform: string;
  };
  anonSessionContext: UnknownSessionContext;
}

export interface ConsentRequestParams {
  consentTimestamp: number;
  email?: string;
  userId?: string;
  isUserKnown: boolean;
  deviceInfo: {
    deviceId: string;
    platform: string;
    appPackageName: string;
  };
}
