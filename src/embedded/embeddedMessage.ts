
export class IterableEmbeddedMessage {
    public metadata: EmbeddedMessageMetadata;
    public elements?: EmbeddedMessageElements;
    public payload?: Array<any>;
    
    constructor(metadata: EmbeddedMessageMetadata,
        elements?: EmbeddedMessageElements,
        payload?: Array<any>) {
        this.metadata = metadata
        this.elements = elements
        this.payload = payload
    }
    
    public initMetaData(messageId: string, campaignId?: number, isProof?: boolean, placementId?: number) {
        let metadata = new EmbeddedMessageMetadata(messageId, campaignId, isProof, placementId)
        
        return new IterableEmbeddedMessage(metadata);
    }
}

export class EmbeddedMessageMetadata {
    public messageId: string;
    public campaignId?: number;
    public isProof?: boolean;
    public placementId?: number;
    
    constructor(messageId: string, campaignId?: number, isProof?: boolean, placementId?: number) {
        this.messageId = messageId;
        this.campaignId = campaignId;
        this.isProof = isProof;
        this.placementId = placementId;
    }
}

export class EmbeddedMessageElements {
    public title?: string = '';
    public body?: string = '';
    public mediaUrl: string = '';
    
    public buttons?: Array<EmbeddedMessageElementsButton>
    public text?: Array<EmbeddedMessageElementsText>
    public defaultAction?: EmbeddedMessageElementsDefaultAction
}

export class EmbeddedMessageElementsButton {
    public id?: string;
    public title?: string;
    public action?: EmbeddedMessageElementsButtonAction;
}

export class EmbeddedMessageElementsText {
    public id: string = '';
    public text?: string;
}

export class EmbeddedMessageElementsButtonAction {
    public type: string = '';
    public data?: string;
}

export class EmbeddedMessageElementsDefaultAction {
    public type: string = '';
    public data?: string;
}