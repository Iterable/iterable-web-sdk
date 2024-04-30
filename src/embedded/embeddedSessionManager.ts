import { v4 as uuidv4 } from 'uuid';
import { trackEmbeddedSession } from '../events/embedded/events';
import { EmbeddedSessionRequestPayload } from '..';

class EmbeddedSession {
  public start?: Date;
  public end?: Date;
  public impressions?: EmbeddedImpression[];
  public id: string;

  constructor(
    start?: Date,
    end?: Date,
    impressions?: EmbeddedImpression[]
  ) {
    this.start = start;
    this.end = end;
    this.impressions = impressions;
    this.id = uuidv4();
  }
}

class EmbeddedImpression {
  public messageId: string;
  public displayCount: number;
  public displayDuration: number;
  public start?: Date = undefined;
  public placementId: number;

  constructor(messageId: string, placementId: number, displayCount?: number, duration?: number) {
    this.messageId = messageId;
    this.displayCount = displayCount ? displayCount : 0;
    this.displayDuration = duration ? duration : 0.0;
    this.placementId = placementId;
  }
}

export class EmbeddedSessionManager {
  private impressions: Map<string, EmbeddedImpression> = new Map();
  public session: EmbeddedSession = new EmbeddedSession(
    undefined,
    undefined,
    [],
  );

  private isTracking(): boolean {
    return this.session.start !== null;
  }

  public startSession() {
    if (this.isTracking()) {
      return;
    }

    this.session = new EmbeddedSession(
      new Date(),
      undefined,
      []
    );
  }

  public async endSession() {
    if (!this.isTracking()) {
      return;
    }

    this.impressions.forEach((_, messageId) =>
      this.pauseImpression(messageId)
    );
    this.session.end = new Date();

    if (!this.session.impressions?.length) {
      return;
    }

    if (this.impressions.size) {
      const sessionPayload: EmbeddedSessionRequestPayload = {
        session: {
          start: this.session.start?.getTime(),
          end: new Date().getTime(),
          id: this.session.id
        },
        impressions: this.getImpressionList(),
      };

      await trackEmbeddedSession(sessionPayload);

      //reset session for next session start
      this.session = new EmbeddedSession(undefined, undefined, []);
      this.impressions = new Map();
    }
  }

  public startImpression(messageId: string, placementId: number) {
    let impressionData: EmbeddedImpression | undefined =
      this.impressions.get(messageId);

    if (!impressionData) {
      impressionData = new EmbeddedImpression(messageId, placementId);
      this.impressions.set(messageId, impressionData);
    }

    impressionData.start = new Date();
  }

  public pauseImpression(messageId: string) {
    const impressionData: EmbeddedImpression | undefined =
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
    const impressionList: EmbeddedImpression[] = [];

    this.impressions.forEach((impressionData) => {
      impressionList.push(
        new EmbeddedImpression(
          impressionData.messageId,
          impressionData.placementId,
          impressionData.displayCount,
          impressionData.displayDuration
        )
      );
    });

    return impressionList;
  }

  private updateDisplayCountAndDuration(impressionData: EmbeddedImpression) {
    if (impressionData.start) {
      impressionData.displayCount = impressionData.displayCount + 1;
      impressionData.displayDuration =
        impressionData.displayDuration +
        (new Date().getTime() - impressionData.start.getTime()) / 1000.0;
      impressionData.start = undefined;
    }

    return impressionData;
  }
}
