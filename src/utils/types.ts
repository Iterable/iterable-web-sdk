import { UpdateUnknownUserParams } from '../users/types';

interface UnknownSessionContext {
  totalUnknownSessionCount?: number;
  lastUnknownSession?: number;
  firstUnknownSession?: number;
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
  unknownSessionContext: UnknownSessionContext;
}
