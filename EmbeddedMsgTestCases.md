### Test Case 1: embeddedPlacementDeserialization_elementsAndCustomPayloadDefined
* Purpose: To test the deserialization of an embedded message placement payload with elements and a custom payload defined.
* Steps:
    * Deserialize the embedded message placement payload.
    * Extract the embedded message object from the placement.
    * Verify the correctness of various properties:
        * Message metadata, including message ID, placement ID, campaign ID, and proof status.
        * Message elements, including title, body, media URL, default action, buttons, and text.
        * Custom payload.
* Expected Outcomes:
    * The deserialized placement and message should not be null.
    * Metadata and element properties should match the expected values.
    * Custom payload should match the expected data.

```javascript
describe('EmbeddedManager', () => {
    test('embeddedPlacementDeserialization_elementsAndCustomPayloadDefined', () => {
        const payload = {} //JSON Data
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
});
```

### Test Case 2: embeddedPlacementDeserialization_noCustomPayloadDefined
* Purpose: To test the deserialization of an embedded message placement payload without a custom payload defined.
* Steps:
    * Deserialize the embedded message placement payload.
    * Extract the embedded message object from the placement.
    * Verify the correctness of various properties, excluding the custom payload.
* Expected Outcomes:
    * The deserialized placement and message should not be null.
    * Metadata and element properties should match the expected values.
    * Custom payload should be null.

```javascript
describe('EmbeddedManager', () => {
    test('embeddedPlacementDeserialization_noCustomPayloadDefined', () => {
        const payload = {} //JSON Data
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
});
```

### Test Case 3: embeddedPlacementDeserialization_noButtonsOrText
* Purpose: To test the deserialization of an embedded message placement payload with no buttons or text elements.
* Steps:
    * Deserialize the embedded message placement payload.
    * Extract the embedded message object from the placement.
    * Verify the correctness of various properties, including message metadata and elements, excluding buttons and text.
* Expected Outcomes:
    * The deserialized placement and message should not be null.
    * Metadata and element properties should match the expected values.
    * Buttons and text should be null.

```javascript
describe('EmbeddedManager', () => {
    test('embeddedPlacementDeserialization_noButtonsOrText', () => {
        const payload = {} //JSON Data
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
});
```

### Test Case 4: embeddedPlacementDeserialization_noElementsOrCustomPayloadDefined
* Purpose: To test the deserialization of an embedded message placement payload with no elements or custom payload defined.
* Steps:
    * Deserialize the embedded message placement payload.
    * Extract the embedded message object from the placement.
    * Verify the correctness of various properties, excluding elements and custom payload.
* Expected Outcomes:
    * The deserialized placement and message should not be null.
    * Metadata should match the expected values.
    * Elements and custom payload should be null.

```javascript
describe('EmbeddedManager', () => {
    test('embeddedPlacementDeserialization_noElementsOrCustomPayloadDefined', () => {
        const payload = {} //JSON Data
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
});
```

### Test Case 5: embeddedPlacementSerialization_elementsAndCustomPayloadDefined
* Purpose: To test the serialization of an embedded message placement object with elements and a custom payload defined.
* Steps:
    * Create an embedded message placement object with elements and a custom payload.
    * Serialize the placement object to JSON.
* Expected Outcomes:
    * The serialized JSON should match the expected JSON payload.

```javascript
describe('EmbeddedManager', () => {
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

        const payload = {}; // JSON Data
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
});
```

### Test Case 6: embeddedPlacementSerialization_noButtons_noText
* Purpose: To test the serialization of an embedded message placement object with no buttons or text elements.
* Steps:
    * Create an embedded message placement object with no buttons or text.
    * Serialize the placement object to JSON.
* Expected Outcomes:
    * The serialized JSON should match the expected JSON payload.

```javascript
describe('EmbeddedManager', () => {
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

        const payload = {}; // JSON Data
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
});
```