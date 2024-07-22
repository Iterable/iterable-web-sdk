/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
export class IterableEmbeddedPlacement {
  public placementId = '';

  public messages: IterableEmbeddedMessage[] = [];

  constructor(placementId: string, messages: IterableEmbeddedMessage[]) {
    this.placementId = placementId;
    this.messages = [...messages];
  }

  static toJSONObject(placement: IterableEmbeddedPlacement) {
    const embeddedPlacementJson: any = {};

    try {
      embeddedPlacementJson.placementId = placement.placementId;

      if (placement?.messages !== null) {
        const messagesJson: any[] = [];

        placement?.messages.forEach((message: any) => {
          messagesJson.push(IterableEmbeddedMessage.toJSONObject(message));
        });
        embeddedPlacementJson.embeddedMessages = messagesJson;
      }
    } catch (e: any) {
      console.log('Error while serializing flex message', e);
    }

    return embeddedPlacementJson;
  }

  static fromJSONObject(placementJson: any): IterableEmbeddedPlacement {
    const parsedJson = placementJson;
    const { placementId } = parsedJson;
    const messagesJson: any[] = parsedJson.embeddedMessages;
    const messages: IterableEmbeddedMessage[] = [];

    messagesJson.forEach((msgJson: any) => {
      const messageJson: any = msgJson;
      const message: IterableEmbeddedMessage =
        IterableEmbeddedMessage.fromJSONObject(messageJson);
      messages.push(message);
    });

    return new IterableEmbeddedPlacement(placementId, messages);
  }
}

export class IterableEmbeddedMessage {
  public metadata: EmbeddedMessageMetadata | null = null;

  public elements?: EmbeddedMessageElements | null = null;

  public payload?: any;

  constructor(
    metadata: EmbeddedMessageMetadata,
    elements?: EmbeddedMessageElements | null,
    payload?: any
  ) {
    this.metadata = metadata;
    this.elements = elements || null;
    this.payload = payload || null;
  }

  static toJSONObject(message: IterableEmbeddedMessage) {
    const embeddedMessageJson: any = {};

    try {
      if (message.metadata && message.elements) {
        embeddedMessageJson.metadata = EmbeddedMessageMetadata.toJSONObject(
          message.metadata
        );
        embeddedMessageJson.elements = EmbeddedMessageElements.toJSONObject(
          message.elements
        );
        embeddedMessageJson.payload = message.payload;
      }
    } catch (e: any) {
      console.log('Error while serializing flex message', e);
    }

    return embeddedMessageJson;
  }

  static fromJSONObject(messageJson: any): IterableEmbeddedMessage {
    const parsedJson = messageJson;
    const metadataJson: any = parsedJson.metadata;
    const metadata: EmbeddedMessageMetadata =
      EmbeddedMessageMetadata.fromJSONObject(metadataJson);

    const elementsJson: any | null = parsedJson.elements;
    const elements: EmbeddedMessageElements | null =
      EmbeddedMessageElements.fromJSONObject(elementsJson);

    const { payload } = parsedJson;

    return new IterableEmbeddedMessage(metadata, elements, payload);
  }
}

export class EmbeddedMessageMetadata {
  public messageId: string;

  public placementId?: string | null;

  public campaignId?: number | null;

  public isProof: boolean;

  constructor(
    messageId: string,
    placementId?: string | null,
    campaignId?: number | null,
    isProof = false
  ) {
    this.messageId = messageId;
    this.placementId = placementId || null;
    this.campaignId = campaignId || null;
    this.isProof = isProof;
  }

  static toJSONObject(metadata: EmbeddedMessageMetadata) {
    const metadataJson: any = {};

    try {
      metadataJson.messageId = metadata.messageId;
      metadataJson.placementId = metadata.placementId;
      metadataJson.campaignId = metadata.campaignId;
      metadataJson.isProof = metadata.isProof;
    } catch (e: any) {
      console.log('Error while serializing flex metadata', e);
    }

    return metadataJson;
  }

  static fromJSONObject(metadataJson: any): EmbeddedMessageMetadata {
    const parsedJson = metadataJson;
    const { messageId } = parsedJson;
    const { placementId } = parsedJson;
    const { campaignId } = parsedJson;
    const { isProof } = parsedJson;

    return new EmbeddedMessageMetadata(
      messageId,
      placementId,
      campaignId,
      isProof
    );
  }
}

export class EmbeddedMessageElements {
  public title?: string | null;

  public body?: string | null;

  public mediaURL?: string | null;

  public defaultAction?: EmbeddedMessageElementsDefaultAction | null;

  public buttons?: EmbeddedMessageElementsButton[] | null;

  public text?: EmbeddedMessageElementsText[] | null;

  constructor(
    title?: string | null,
    body?: string | null,
    mediaURL?: string | null,
    defaultAction?: EmbeddedMessageElementsDefaultAction | null,
    buttons?: EmbeddedMessageElementsButton[] | null,
    text?: EmbeddedMessageElementsText[] | null
  ) {
    this.title = title;
    this.body = body;
    this.mediaURL = mediaURL;
    this.defaultAction = defaultAction;
    this.buttons = buttons;
    this.text = text;
  }

  static toJSONObject(elements: EmbeddedMessageElements | null) {
    const elementsJson: any = {};

    try {
      elementsJson.title = elements?.title;
      elementsJson.body = elements?.body;
      elementsJson.mediaUrl = elements?.mediaURL;

      if (elements?.defaultAction) {
        elementsJson.defaultAction =
          EmbeddedMessageElementsDefaultAction.toJSONObject(
            elements.defaultAction
          );
      }

      if (elements?.buttons) {
        const buttonsJson: any = [];

        elements?.buttons.forEach((button) =>
          buttonsJson.push(EmbeddedMessageElementsButton.toJSONObject(button))
        );
        elementsJson.buttons = buttonsJson;
      }

      if (elements?.text) {
        const textJson: any = [];

        elements?.text.forEach((text) =>
          textJson.push(EmbeddedMessageElementsText.toJSONObject(text))
        );

        elementsJson.text = textJson;
      }
    } catch (e: any) {
      console.log('Error while serializing flex elements', e);
    }

    return elementsJson;
  }

  static fromJSONObject(
    elementsJson: any | null
  ): EmbeddedMessageElements | null {
    if (!elementsJson) {
      return null;
    }

    const parsedJson = elementsJson;
    const { title } = parsedJson;
    const { body } = parsedJson;
    const mediaURL: string | null = parsedJson.mediaUrl;

    const defaultActionJson: any | null = parsedJson.defaultAction;
    let defaultAction: EmbeddedMessageElementsDefaultAction | null = null;

    if (defaultActionJson !== null) {
      defaultAction =
        EmbeddedMessageElementsDefaultAction.fromJSONObject(defaultActionJson);
    }

    const buttonsJson: [] | null = parsedJson.buttons;
    let buttons: EmbeddedMessageElementsButton[] | null = [];

    if (buttonsJson) {
      buttonsJson.forEach((button) => {
        const buttonFromJson: EmbeddedMessageElementsButton =
          EmbeddedMessageElementsButton.fromJSONObject(button);
        buttons?.push(buttonFromJson);
      });
    } else {
      buttons = null;
    }

    const textsJson: [] | null = elementsJson.text;
    let texts: EmbeddedMessageElementsText[] | null = [];

    if (textsJson) {
      textsJson.forEach((text) => {
        const textFromJson: EmbeddedMessageElementsText =
          EmbeddedMessageElementsText.fromJSONObject(text);
        texts?.push(textFromJson);
      });
    } else {
      texts = null;
    }

    return new EmbeddedMessageElements(
      title,
      body,
      mediaURL,
      defaultAction,
      buttons,
      texts
    );
  }
}

export class EmbeddedMessageElementsButton {
  public id: string;

  public title?: string | null;

  public action?: EmbeddedMessageElementsButtonAction | null;

  constructor(
    id: string,
    title?: string | null,
    action?: EmbeddedMessageElementsButtonAction | null
  ) {
    this.id = id;
    this.title = title;
    this.action = action;
  }

  static toJSONObject(button: EmbeddedMessageElementsButton) {
    const buttonJson: any = {};

    try {
      buttonJson.id = button.id;
      buttonJson.title = button.title;

      if (button.action) {
        buttonJson.action = EmbeddedMessageElementsButtonAction.toJSONObject(
          button.action
        );
      }
    } catch (e: any) {
      console.log('Error while serializing flex message button', e);
    }

    return buttonJson;
  }

  static fromJSONObject(buttonJson: any): EmbeddedMessageElementsButton {
    const parsedJson = buttonJson;
    const { id } = parsedJson;
    const { title } = parsedJson;

    const buttonActionJson: any | null = parsedJson.action;
    let action: EmbeddedMessageElementsButtonAction | null = null;
    if (buttonActionJson !== null) {
      action =
        EmbeddedMessageElementsButtonAction.fromJSONObject(buttonActionJson);
    }

    return new EmbeddedMessageElementsButton(id, title, action);
  }
}

export class EmbeddedMessageElementsDefaultAction {
  public type: string;

  public data: string;

  constructor(type: string, data: string) {
    this.type = type;
    this.data = data;
  }

  static toJSONObject(defaultAction: EmbeddedMessageElementsDefaultAction) {
    const defaultActionJson: any = {};

    try {
      defaultActionJson.type = defaultAction.type;
      defaultActionJson.data = defaultAction.data;
    } catch (e: any) {
      console.log('Error while serializing flex default action', e);
    }

    return defaultActionJson;
  }

  static fromJSONObject(
    defaultActionJson: any
  ): EmbeddedMessageElementsDefaultAction {
    const parsedJson = defaultActionJson;
    const { type } = parsedJson;
    const { data } = parsedJson;

    return new EmbeddedMessageElementsDefaultAction(type, data);
  }
}

export class EmbeddedMessageElementsButtonAction {
  public type: string;

  public data: string;

  constructor(type: string, data: string) {
    this.type = type;
    this.data = data;
  }

  static toJSONObject(buttonAction: EmbeddedMessageElementsButtonAction) {
    const buttonActionJson: any = {};

    try {
      buttonActionJson.type = buttonAction.type;
      buttonActionJson.data = buttonAction.data;
    } catch (e: any) {
      console.log('Error while serializing flex default action', e);
    }

    return buttonActionJson;
  }

  static fromJSONObject(
    buttonActionJson: any
  ): EmbeddedMessageElementsButtonAction {
    const parsedJson = buttonActionJson;
    const { type } = parsedJson;
    const { data } = parsedJson;

    return new EmbeddedMessageElementsButtonAction(type, data);
  }
}

export class EmbeddedMessageElementsText {
  public id: string;

  public text?: string | null;

  public label?: string | null;

  constructor(id: string, text?: string | null, label?: string | null) {
    this.id = id;
    this.text = text;
    this.label = label;
  }

  static toJSONObject(text: EmbeddedMessageElementsText) {
    const textJson: any = {};

    try {
      textJson.id = text.id;
      textJson.text = text.text;
      textJson.label = text.label;
    } catch (e: any) {
      console.log('Error while serializing flex message text', e);
    }

    return textJson;
  }

  static fromJSONObject(textJson: any): EmbeddedMessageElementsText {
    const parsedJson = textJson;
    const { id, text, label } = parsedJson;

    return new EmbeddedMessageElementsText(id, text, label);
  }
}
