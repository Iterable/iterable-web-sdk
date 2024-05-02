import { v4 as uuidv4 } from 'uuid';
import {
  IEmbeddedImpressionData,
  IEmbeddedSession
} from '../../src/events/embedded/types';
import { trackEmbeddedSession } from '../events/embedded/events';

class EmbeddedSession {
  public start?: Date;
  public end?: Date;
  public placementId?: string;
  public impressions?: Array<IEmbeddedImpressionData>;
  public id: string;

  constructor(
    start?: Date,
    end?: Date,
    placementId?: string,
    impressions?: Array<IEmbeddedImpressionData>
  ) {
    this.start = start;
    this.end = end;
    this.placementId = placementId;
    this.impressions = impressions;
    this.id = uuidv4();
  }
}

class EmbeddedImpressionData {
  public messageId: string;
  public displayCount: number;
  public duration: number;
  public start?: Date = undefined;

  constructor(messageId: string, displayCount?: number, duration?: number) {
    this.messageId = messageId;
    this.displayCount = displayCount ? displayCount : 0;
    this.duration = duration ? duration : 0.0;
  }
}

export class EmbeddedSessionManager {
  private impressions: Map<string, IEmbeddedImpressionData> = new Map();
  public session: IEmbeddedSession = new EmbeddedSession(
    undefined,
    undefined,
    '0',
    undefined
  );

  private isTracking(): boolean {
    return this.session.start !== undefined;
  }

  public startSession() {
    if (this.isTracking()) {
      return;
    }

    this.session.start = new Date();
  }

  public async endSession() {
    if (!this.isTracking()) {
      return;
    }

    this.impressions.forEach((impressionData, messageId) =>
      this.pauseImpression(messageId)
    );
    this.session.end = new Date();

    if (this.impressions.size) {
      const sessionToTrack = new EmbeddedSession(
        this.session.start,
        new Date(),
        '0',
        this.getImpressionList()
      );

      await trackEmbeddedSession(sessionToTrack);
      //reset session for next session start
      this.session = new EmbeddedSession(undefined, undefined, '0', undefined);
      this.impressions = new Map();
    }
  }

  public startImpression(messageId: string) {
    let impressionData: IEmbeddedImpressionData | undefined =
      this.impressions.get(messageId);

    if (!impressionData) {
      impressionData = new EmbeddedImpressionData(messageId);
      this.impressions.set(messageId, impressionData);
    }

    impressionData.start = new Date();
  }

  public pauseImpression(messageId: string) {
    const impressionData: IEmbeddedImpressionData | undefined =
      this.impressions.get(messageId);

    if (!impressionData) {
      return;
    }

    if (impressionData?.start === null) {
      return;
    }

    this.updateDisplayCountAndDuration(impressionData);
  }

  private getImpressionList() {
    const impressionList: Array<EmbeddedImpressionData> = [];

    this.impressions.forEach((impressionData) => {
      impressionList.push(
        new EmbeddedImpressionData(
          impressionData.messageId,
          impressionData.displayCount,
          impressionData.duration
        )
      );
    });

    return impressionList;
  }

  private updateDisplayCountAndDuration(
    impressionData: IEmbeddedImpressionData
  ) {
    if (impressionData.start) {
      impressionData.displayCount = impressionData.displayCount + 1;
      impressionData.duration =
        impressionData.duration +
        (new Date().getTime() - impressionData.start.getTime()) / 1000.0;
      impressionData.start = undefined;
    }

    return impressionData;
  }
}
