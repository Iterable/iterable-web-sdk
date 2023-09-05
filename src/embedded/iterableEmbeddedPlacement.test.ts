import {
    IterableEmbeddedPlacement,
    EmbeddedMessageMetadata,
    EmbeddedMessageElementsText,
    IterableEmbeddedMessage,
    EmbeddedMessageElements,
    EmbeddedMessageElementsDefaultAction,
    EmbeddedMessageElementsButtonAction,
    EmbeddedMessageElementsButton
} from './embeddedPlacement';

describe('EmbeddedManager', () => {
    test('embeddedPlacementDeserialization_elementsAndCustomPayloadDefined', () => {
        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            },
                            "elements": {
                                "title": "Iterable Coffee Shoppe",
                                "body": "SAVE 15% OFF NOW",
                                "mediaUrl": "http://placekitten.com/200/300",
                                "defaultAction": {
                                    "type": "someType",
                                    "data": "someData"
                                },
                                "buttons": [
                                    {
                                        "id": "reward-button",
                                        "title": "REDEEM MEOW",
                                        "action": {
                                            "type": "openUrl",
                                            "data": "https://www.google.com"
                                        }
                                    }
                                ],
                                "text": [
                                    {
                                        "id": "body",
                                        "text": "CATS RULE!!!",
                                        "label": "label"
                                    }
                                ]
                            },
                            "payload": {
                                "someKey": "someValue"
                            }
                        }
                    ]
                }
            ]
        };
        const jsonArray = payload.placements

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload
            const placementJson = jsonArray[0];

            // WHEN you deserialize the embedded message placement payload
            const placement = IterableEmbeddedPlacement.fromJSONObject(placementJson);

            const message = placement.messages[0];

            const payload: any = {};
            payload['someKey'] = 'someValue';

            // THEN we get appropriate embedded message object and associated placement id
            expect(placement).not.toBeNull();
            expect(placement.placementId).toBe('0');


            expect(message.metadata?.messageId).toBe('doibjo4590340oidiobnw');
            expect(message.metadata?.placementId).toBe('mbn8489b7ehycy');
            expect(message.metadata?.campaignId).toBe(2324);
            expect(message.metadata?.isProof).toBe(true);

            expect(message.elements?.title).toBe('Iterable Coffee Shoppe');
            expect(message.elements?.body).toBe('SAVE 15% OFF NOW');
            expect(message.elements?.mediaURL).toBe('http://placekitten.com/200/300');

            expect(message.elements?.defaultAction?.type).toBe('someType');
            expect(message.elements?.defaultAction?.data).toBe('someData');

            const btn = message.elements?.buttons?.length ? message.elements?.buttons[0] : null;

            expect(btn?.id).toBe('reward-button');
            expect(btn?.title).toBe('REDEEM MEOW');
            expect(btn?.action?.type).toBe('openUrl');
            expect(btn?.action?.data).toBe('https://www.google.com');

            const txt = message.elements?.text?.length ? message.elements?.text[0] : null;

            expect(txt?.id).toBe('body');
            expect(txt?.text).toBe('CATS RULE!!!');
            expect(txt?.label).toBe('label');

            // Assuming your JSON library supports deep equality comparison
            expect(message.payload).toEqual(payload);
        }

    });

    test('embeddedPlacementDeserialization_noCustomPayloadDefined', () => {
        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            },
                            "elements": {
                                "title": "Iterable Coffee Shoppe",
                                "body": "SAVE 15% OFF NOW",
                                "mediaUrl": "http://placekitten.com/200/300",
                                "defaultAction": {
                                    "type": "someType",
                                    "data": "someData"
                                },
                                "buttons": [
                                    {
                                        "id": "reward-button",
                                        "title": "REDEEM MEOW",
                                        "action": {
                                            "type": "openUrl",
                                            "data": "https://www.google.com"
                                        }
                                    }
                                ],
                                "text": [
                                    {
                                        "id": "body",
                                        "text": "CATS RULE!!!",
                                        "label": "label"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        };

        const jsonArray = payload.placements;

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload
            const placementJson = jsonArray[0];

            // WHEN you deserialize the embedded message placement payload
            const placement = IterableEmbeddedPlacement.fromJSONObject(placementJson);

            const message = placement.messages[0];

            // THEN we get appropriate embedded message object and associated placement id
            expect(placement).not.toBeNull();
            expect(placement.placementId).toBe('0');

            expect(message.metadata?.messageId).toBe('doibjo4590340oidiobnw');
            expect(message.metadata?.placementId).toBe('mbn8489b7ehycy');
            expect(message.metadata?.campaignId).toBe(2324);
            expect(message.metadata?.isProof).toBe(true);

            expect(message.elements?.title).toBe('Iterable Coffee Shoppe');
            expect(message.elements?.body).toBe('SAVE 15% OFF NOW');
            expect(message.elements?.mediaURL).toBe('http://placekitten.com/200/300');

            expect(message.elements?.defaultAction?.type).toBe('someType');
            expect(message.elements?.defaultAction?.data).toBe('someData');

            const btn = message.elements?.buttons?.length ? message.elements?.buttons[0] : null;

            expect(btn?.id).toBe('reward-button');
            expect(btn?.title).toBe('REDEEM MEOW');

            expect(message.elements?.defaultAction?.type).toBe('someType');
            expect(message.elements?.defaultAction?.data).toBe('someData');

            const txt = message.elements?.text?.length ? message.elements?.text[0] : null;

            expect(txt?.id).toBe('body');
            expect(txt?.text).toBe('CATS RULE!!!');
            expect(txt?.label).toBe('label');

            expect(message.payload).toBeNull();
        }
    });

    test('embeddedPlacementDeserialization_noButtonsOrText', () => {
        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            },
                            "elements": {
                                "title": "Iterable Coffee Shoppe",
                                "body": "SAVE 15% OFF NOW",
                                "mediaUrl": "http://placekitten.com/200/300",
                                "defaultAction": {
                                    "type": "someType",
                                    "data": "someData"
                                }
                            },
                            "payload": {
                                "someKey": "someValue"
                            }
                        }
                    ]
                }
            ]
        };
        const jsonArray = payload.placements;

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload
            const placementJson = jsonArray[0];

            // WHEN you deserialize the embedded message placement payload
            const placement = IterableEmbeddedPlacement.fromJSONObject(placementJson);

            const message = placement.messages[0];

            const payload: any = {};
            payload['someKey'] = 'someValue';

            // THEN we get appropriate embedded message object and associated placement id
            expect(placement).not.toBeNull();
            expect(placement.placementId).toBe('0');

            expect(message.metadata?.messageId).toBe('doibjo4590340oidiobnw');
            expect(message.metadata?.placementId).toBe('mbn8489b7ehycy');
            expect(message.metadata?.campaignId).toBe(2324);
            expect(message.metadata?.isProof).toBe(true);

            expect(message.elements?.title).toBe('Iterable Coffee Shoppe');
            expect(message.elements?.body).toBe('SAVE 15% OFF NOW');
            expect(message.elements?.mediaURL).toBe('http://placekitten.com/200/300');

            expect(message.elements?.defaultAction?.type).toBe('someType');
            expect(message.elements?.defaultAction?.data).toBe('someData');

            expect(message.elements?.buttons).toBeNull();
            expect(message.elements?.text).toBeNull();

            // Assuming your JSON library supports deep equality comparison
            expect(message.payload).toEqual(payload);
        }
    });

    test('embeddedPlacementDeserialization_noElementsOrCustomPayloadDefined', () => {
        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            }
                        }
                    ]
                }
            ]
        };

        const jsonArray = payload.placements;

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload with optional elements
            const placementJson = jsonArray[0];

            // WHEN you deserialize the embedded message placement payload
            const placement = IterableEmbeddedPlacement.fromJSONObject(placementJson);

            const message = placement.messages[0];

            // THEN we get appropriate embedded message object and associated placement id
            expect(placement).not.toBeNull();
            expect(placement.placementId).toBe('0');

            expect(message.metadata?.messageId).toBe('doibjo4590340oidiobnw');
            expect(message.metadata?.placementId).toBe('mbn8489b7ehycy');
            expect(message.metadata?.campaignId).toBe(2324);
            expect(message.metadata?.isProof).toBe(true);

            expect(message.elements).toBeNull();
            expect(message.payload).toBeNull();
        }
    });


    test('embeddedPlacementSerialization_elementsAndCustomPayloadDefined', () => {
        const embeddedMessageMetadata = new EmbeddedMessageMetadata(
            'doibjo4590340oidiobnw',
            'mbn8489b7ehycy',
            2324,
            true
        );

        const embeddedMessageDefaultAction = new EmbeddedMessageElementsDefaultAction(
            'someType', 'someData'
        );

        const embeddedMessageElementsButtonAction = new EmbeddedMessageElementsButtonAction(
            'openUrl', 'https://www.google.com'
        );

        const embeddedMessageButtons = [
            new EmbeddedMessageElementsButton('reward-button', 'REDEEM MEOW', embeddedMessageElementsButtonAction)
        ];

        const embeddedMessageText = [
            new EmbeddedMessageElementsText('body', 'CATS RULE!!!', 'label')
        ];

        const embeddedMessageElements = new EmbeddedMessageElements(
            'Iterable Coffee Shoppe',
            'SAVE 15% OFF NOW',
            'http://placekitten.com/200/300',
            embeddedMessageDefaultAction,
            embeddedMessageButtons,
            embeddedMessageText
        );

        const customPayload: any = {};
        customPayload['someKey'] = 'someValue';

        const embeddedMessage = new IterableEmbeddedMessage(embeddedMessageMetadata, embeddedMessageElements, customPayload);

        const placementId = '0';
        const messages = [embeddedMessage];

        const embeddedMessagePlacement = new IterableEmbeddedPlacement(placementId, messages);

        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            },
                            "elements": {
                                "title": "Iterable Coffee Shoppe",
                                "body": "SAVE 15% OFF NOW",
                                "mediaUrl": "http://placekitten.com/200/300",
                                "defaultAction": {
                                    "type": "someType",
                                    "data": "someData"
                                },
                                "buttons": [
                                    {
                                        "id": "reward-button",
                                        "title": "REDEEM MEOW",
                                        "action": {
                                            "type": "openUrl",
                                            "data": "https://www.google.com"
                                        }
                                    }
                                ],
                                "text": [
                                    {
                                        "id": "body",
                                        "text": "CATS RULE!!!",
                                        "label": "label"
                                    }
                                ]
                            },
                            "payload": {
                                "someKey": "someValue"
                            }
                        }
                    ]
                }
            ]
        };
        const jsonArray = payload.placements;

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload
            const expectedPlacementJson = jsonArray[0];

            // WHEN you serialize the embedded message payload
            const placementJson = IterableEmbeddedPlacement.toJSONObject(embeddedMessagePlacement);

            // THEN we get appropriate embedded message object
            expect(placementJson).toEqual(expectedPlacementJson);
        }
    });

    test('embeddedPlacementSerialization_noButtons_noText', () => {
        const embeddedMessageMetadata = new EmbeddedMessageMetadata(
            'doibjo4590340oidiobnw',
            'mbn8489b7ehycy',
            2324,
            true
        );

        const embeddedMessageDefaultAction = new EmbeddedMessageElementsDefaultAction(
            'someType', 'someData'
        );

        const embeddedMessageElements = new EmbeddedMessageElements(
            'Iterable Coffee Shoppe',
            'SAVE 15% OFF NOW',
            'http://placekitten.com/200/300',
            embeddedMessageDefaultAction
        );

        const customPayload: any = {};
        customPayload['someKey'] = 'someValue';

        const embeddedMessage = new IterableEmbeddedMessage(embeddedMessageMetadata, embeddedMessageElements, customPayload);

        const placementId = '0';
        const messages = [embeddedMessage];

        const embeddedMessagePlacement = new IterableEmbeddedPlacement(placementId, messages);

        const payload = {
            "placements": [
                {
                    "placementId": "0",
                    "embeddedMessages": [
                        {
                            "metadata": {
                                "messageId": "doibjo4590340oidiobnw",
                                "placementId": "mbn8489b7ehycy",
                                "campaignId": 2324,
                                "isProof": true
                            },
                            "elements": {
                                "title": "Iterable Coffee Shoppe",
                                "body": "SAVE 15% OFF NOW",
                                "mediaUrl": "http://placekitten.com/200/300",
                                "defaultAction": {
                                    "type": "someType",
                                    "data": "someData"
                                }
                            },
                            "payload": {
                                "someKey": "someValue"
                            }
                        }
                    ]
                }
            ]
        };
        const jsonArray = payload.placements[0].embeddedMessages;

        if (jsonArray !== null) {
            // GIVEN an embedded message placement payload
            const expectedPlacementJson = jsonArray[0];

            // WHEN you serialize the embedded message payload
            const placementJson = IterableEmbeddedPlacement.toJSONObject(embeddedMessagePlacement);

            // THEN we get the appropriate embedded message object
            expect(placementJson).toEqual(expectedPlacementJson);
        }
    });
})