export class IterableEmbeddedMessage {
  public metadata: EmbeddedMessageMetadata;
  public elements?: EmbeddedMessageElements;
  public payload?: Record<string, any>;

  constructor(
    metadata: EmbeddedMessageMetadata,
    elements?: EmbeddedMessageElements,
    payload?: Record<string, any>
  ) {
    this.metadata = metadata;
    this.elements = elements;
    this.payload = payload;
  }

  public initMetaData(
    messageId: string,
    campaignId?: number,
    isProof?: boolean,
    placementId?: number
  ) {
    const metadata = new EmbeddedMessageMetadata(
      messageId,
      campaignId,
      isProof,
      placementId
    );

    return new IterableEmbeddedMessage(metadata);
  }
}

export class EmbeddedMessageMetadata {
  public messageId: string;
  public campaignId?: number;
  public isProof?: boolean;
  public placementId?: number;

  constructor(
    messageId: string,
    campaignId?: number,
    isProof?: boolean,
    placementId?: number
  ) {
    this.messageId = messageId;
    this.campaignId = campaignId;
    this.isProof = isProof;
    this.placementId = placementId;
  }
}

export class EmbeddedMessageElements {
  public title?: string = '';
  public body?: string = '';
  public mediaUrl = '';

  public buttons?: EmbeddedMessageElementsButton[];
  public text?: EmbeddedMessageElementsText[];
  public defaultAction?: EmbeddedMessageElementsDefaultAction;
}

export class EmbeddedMessageElementsButton {
  public id?: string;
  public title?: string;
  public action?: EmbeddedMessageElementsButtonAction;
}

export class EmbeddedMessageElementsText {
  public id = '';
  public text?: string;
}

export class EmbeddedMessageElementsButtonAction {
  public type = '';
  public data?: string;
}

export class EmbeddedMessageElementsDefaultAction {
  public type = '';
  public data?: string;
}
