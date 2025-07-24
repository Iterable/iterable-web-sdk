import { UpdateUnknownUserParams } from '../users/types';

interface UnknownSessionContext {
  totalUnknownSessionCount?: number;
  lastUnknownSession?: number;
  firstUnknownSession?: number;
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
  unknownSessionContext: UnknownSessionContext;
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
