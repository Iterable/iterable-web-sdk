# EmbeddedMessageManager Class
The `EmbeddedManager` class is a fundamental component of the Web SDK project that facilitates the seamless integration and management of embedded messages 
and interactions within web applications. It offers developers a set of methods and functionalities to efficiently handle messages sent from external sources 
and provides mechanisms to respond to updates and actions associated with these messages.

Key Features and Functionalities:

- Message Synchronization: Developers can utilize the syncMessages method to synchronize messages for a specific user. Upon synchronization, a provided callback function is invoked, allowing developers to take actions based on the synchronized messages.
- Listeners: The class allows developers to register listeners using the addUpdateListener and addActionHandler methods. These listeners enable the application to respond to updates and actions related to embedded messages.
- Handlers Retrieval: The class offers methods to retrieve arrays of registered update handler using getUpdateHandlers. This enables developers to manage and interact with these handlers as needed.

Properties
- messages: IEmbeddedMessage[]: An array that holds the embedded messages received.

### Table of Contents
- [Syncing Messages](#syncing-messages)
- [Adding Listeners](#adding-listeners)
- [Retrieving Update Handlers](#retrieving-update-handlers)

# Usage

1. `Syncing Messages`
The EmbeddedManager class provides a method to sync messages for a specific user and invoke a callback upon synchronization.
public async syncMessages(userIdOrEmail: string, platform: string, sdkVersion: string, packageName: string, callback: () => void, placementIds?: number[]): Promise<void>;

Params
- userIdOrEmail: The identifier of the user for whom to sync messages.
- platform: On which platform you are working.
- sdkVersion: Used sdkVersion.
- packageName: packageName of your website.
- callback: A function to be called after message synchronization is complete.
- placementIds: Array of placementIds for which you want messages.

```ts
import { EmbeddedManager } from '@iterable/web-sdk';

await new EmbeddedManager().syncMessages('harrymash2006', 'Web', '1', 'my-website'() => console.log('Synced message'));
```

2. `Adding Listeners`
Developers can register listeners to handle updates related to embedded messages.
public addUpdateListener(updateListener: EmbeddedMessageUpdateHandler): void

- updateListener: A listener that implements the EmbeddedMessageUpdateHandler interface to handle message update events.

3. `Retrieving Update Handlers`
This method retrieves an array of registered update handlers.
public getUpdateHandlers(): Array<EmbeddedMessageUpdateHandler>

Public Methods
- getMessagesForPlacement(placementId: number): returns the embedded messages for the specific placement.
- addUpdateListener(updateListener: EmbeddedMessageUpdateHandler): registered listener to array to manage all the listeners.

Private Methods
- The following are private methods used internally by the class:

- retrieveEmbeddedMessages(userIdOrEmail: string, platform: string, sdkVersion: string, packageName: string, placementIds?: number[]): Retrieves embedded messages for the specified user and placement.
- getEmbeddedMessages(placements: any): returns the embedded messages for the multiple placement.
- setMessages(_processor: EmbeddedMessagingProcessor): Sets the internal messages array based on the provided processor.
- getMessages(): returns all the embedded messages.
- trackNewlyRetrieved(_processor: EmbeddedMessagingProcessor, userIdOrEmail: string): Tracks newly retrieved messages and invokes tracking methods.
- notifyUpdateDelegates(): Notifies registered update listeners of message updates.
- notifyDelegatesOfInvalidApiKeyOrSyncStop(): Notifies listeners when the API key is invalid or synchronization stops.

# EmbeddedSessionManager Class

The `EmbeddedSessionManager` class is a core component of the Web SDK project designed to manage user interactions with embedded messages in web applications. This class offers developers a range of functions to track and analyze user sessions, impressions, and engagement with embedded messages. It provides methods to start and end sessions, track impressions for individual messages, and retrieve impression data. By utilizing these functionalities, developers can gain insights into how users engage with embedded messages, enabling them to optimize user experiences and measure the effectiveness of message content.

Properties
- impressions: Map<string, IEmbeddedImpression>: A map that holds impression data for embedded messages.
- session: IEmbeddedSession: An object representing the current embedded session.

### Table of Contents
- [Checking Tracking Status](#checking-tracking-status)
- [Starting a Session](#starting-a-session)
- [Ending a Session](#ending-a-session)
- [Managing Impressions](#managing-impressions)

# Usage

1. `Checking Tracking Status`
The EmbeddedSessionManager class provides a method to check if session tracking is active.

```ts
private isTracking(): boolean
```
Returns true if tracking is active, otherwise false.

2. `Starting a Session`
    Developers can start a new embedded session using the startSession method.

```ts
public startSession(): void
```
This method initializes a new session, provided that tracking is not already active.

3. `Ending a Session`
The class offers the endSession method to end the current session and track impression data.

```ts
public async endSession(): Promise<void>
```
This method finalizes the session, collects impression data, and triggers the tracking of the session if applicable.

4. `Managing Impressions`
- startImpression(messageId: string): Starts tracking an impression for a specific message.
The startImpression function initiates the tracking of an impression associated with a specific message. Impressions provide insights into how users engage with embedded messages, allowing developers to measure their effectiveness.

    When a message's impression tracking starts, the following steps are taken:

    - The function accepts a messageId parameter, which uniquely identifies the message for which the impression is being tracked.
    - If an impression for the provided messageId already exists in the impressions map, the function updates the existing impression's start time to the current date and time.
    - If an impression for the provided messageId does not exist, a new EmbeddedImpressionData object is created, representing the impression. This object's start time is set to the current date and time, and it is added to the impressions map with the messageId as the key.

- pauseImpression(messageId: string): Pauses tracking for an impression associated with a message.
The pauseImpression function temporarily halts the tracking of an ongoing impression associated with a particular message. Pausing impressions allows developers to accurately measure how long users engage with a message before taking actions.

    When an impression's tracking is paused, the following actions occur:

    - The function receives a messageId parameter, identifying the message whose impression tracking needs to be paused.
    - The function checks if an impression with the given messageId exists in the impressions map.
        - If an impression is found, its start time is used to calculate the duration of engagement for the impression.
        - The impression's displayCount is incremented to keep track of the number of times the impression has been displayed.
        - The calculated duration is added to the impression's duration value, indicating the total time users have spent engaging with the message.
        - The impression's start time is reset to undefined, effectively pausing the tracking of the current engagement.

- getImpressionList(): Retrieves a list of tracked impressions.
The getImpressionList function retrieves a list of tracked impressions, including their associated metadata. This function is essential for reporting and analyzing user engagement with embedded messages.

    When calling getImpressionList:

    - The function initializes an empty array to hold the list of impressions.
    - It iterates through all impressions stored in the impressions map.
    - For each impression, an EmbeddedImpressionData object is created, containing the messageId, displayCount, and duration of the impression. This object is added to the array.
    - Once all impressions have been processed, the array of impression data is returned.

- updateDisplayCountAndDuration(impressionData: IEmbeddedImpressionData): updates the count of message display and update the duration.

# Tracking Function

1. `trackEmbeddedMessageReceived(payload: IEmbeddedMessage)`
The tracking function `trackEmbeddedMessageReceived` enables developers to track received embedded messages and send relevant data to the server for analysis.

- Parameters
  - payload: IEmbeddedMessage: The payload representing the received embedded message.
- Return Value
  - The function returns a promise containing the result of the tracking request, which is a part of the baseIterableRequest function.
- Behavior
  - The function constructs a POST request to the server endpoint /embedded-messaging/events/received.
  - It packages the received embedded message data in the request payload.
  - The function performs validation of the request payload using the trackEmbeddedMessageSchema schema.
  - The request is sent to the server for analysis.
- Example
```ts
const receivedMessage = {
      messageId: 'abc123',
      metadata: {
        messageId: 'abc123',
        campaignId: 1,
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!',
      },
      deviceInfo: { appPackageName: 'my-lil-site' }
    };

trackEmbeddedMessageReceived(receivedMessage)
  .then(response => {
    console.log('Message reception tracked:', response);
  })
  .catch(error => {
    console.error('Error tracking message reception:', error);
  });
```

2. `trackEmbeddedMessageClick(payload: IEmbeddedMessageMetadata, buttonIdentifier: string, clickedUrl: string, appPackageName: string)`
The tracking function `trackEmbeddedMessageClick` enables developers to track user clicks on buttons within embedded messages. And it's also enables developers to collect and analyze user interaction data to improve engagement and measure the effectiveness of message content.

- Parameters
  - payload: IEmbeddedMessageMetadata: Metadata associated with the embedded message.
  - buttonIdentifier: string: Unique identifier for the clicked button.
  - clickedUrl: string: The URL associated with the clicked button.
  - appPackageName: string: The package name of the application.
- Return Value
  - The function returns a promise containing the result of the tracking request, which is a part of the baseIterableRequest function.
- Behavior
  - The function constructs a POST request to the server endpoint /embedded-messaging/events/click.
  - It packages the following data in the request payload:
    - messageId: The unique identifier of the embedded message.
    - buttonIdentifier: The identifier of the clicked button.
    - targetUrl: The URL associated with the clicked button.
    - deviceInfo: An object containing the package name of the application.
  - The function performs validation of the request payload using the trackEmbeddedMessageClickSchema schema.
  - The request is sent to the server for analysis.
- Example
```ts
const payload = {
  messageId: 'abc123',
  campaignId: 1,
};

const buttonIdentifier = 'button-123';
const clickedUrl = 'https://example.com';
const appPackageName = 'com.example.app';

trackEmbeddedMessageClick(payload, buttonIdentifier, clickedUrl, appPackageName)
  .then(response => {
    console.log('Click tracking successful:', response);
  })
  .catch(error => {
    console.error('Error tracking click:', error);
  });
```

3. `trackEmbeddedSession(payload: IEmbeddedSession)`
The tracking function `trackEmbeddedSession` enables developers to track impressions and user sessions associated with embedded messages. The function facilitates data collection for analysis and insights into user engagement patterns.

- Parameters
  - payload: IEmbeddedSession: The payload representing the session to be tracked.
- Return Value
  - The function returns a promise containing the result of the tracking request, which is a part of the baseIterableRequest function.
- Behavior
  - The function constructs a POST request to the server endpoint /embedded-messaging/events/impression.
  - It packages the session data in the request payload.
  - The function performs validation of the request payload using the trackEmbeddedSessionSchema schema.
  - The request is sent to the server for analysis.
- Example
```ts
const sessionData = {
  "session": {
    "id": "123",
    "start": 18686876876876,
    "end": 1008083828723
  },
  "impressions": [
    {
      "messageId": "abc123",
      "displayCount": 3,
      "duration": 10,
      "displayDuration": 10
    },
    {
      "messageId": "def456",
      "displayCount": 2,
      "duration": 8,
      "displayDuration": 8
    }
  ],
  deviceInfo: { appPackageName: 'my-lil-site' }
}

trackEmbeddedSession(sessionData)
  .then(response => {
    console.log('Session tracking successful:', response);
  })
  .catch(error => {
    console.error('Error tracking session:', error);
  });
```

4. `trackEmbeddedMessagingDismiss(payload: EnbeddedMessagingDismiss)`
The tracking function `trackEmbeddedMessagingDismiss` enables developers to track dismiss event associated with embedded messages. The function facilitates data collection for analysis and insights into user engagement patterns.

- Parameters
  - payload: EnbeddedMessagingDismiss: The payload representing the message to be tracked.
- Return Value
  - The function returns a promise containing the result of the tracking request, which is a part of the baseIterableRequest function.
- Behavior
  - The function constructs a POST request to the server endpoint /embedded-messaging/events/dismiss.
  - It packages the session data in the request payload.
  - The function performs validation of the request payload using the embaddedMessagingDismissSchema schema.
  - The request is sent to the server for analysis.
- Example
```ts
const sessionData = {
      [Functions.checkEmailValidation(userId) ? 'email' : 'userId']: userId,
      messageId: messageId,
      buttonIdentifier: '123',
      deviceInfo: {
        deviceId: '123',
        platform: 'web',
        appPackageName: 'my-website'
      },
      createdAt: Date.now()
    };

    trackEmbeddedMessagingDismiss(sessionData)
      .then((response) => {
         console.log('Message dismiss tracking successful:', response);
      })
      .catch((error) => {
         console.error('Error tracking message dismiss session:', error);
      });
```

5. `trackEmbeddedMessagingSession(payload: EnbeddedMessagingSession)`
The tracking function `trackEmbeddedMessagingSession` enables developers to track session event associated with embedded messages. The function facilitates data collection for analysis and insights into user engagement patterns.

- Parameters
  - payload: EnbeddedMessagingSession: The payload representing the message session to be tracked.
- Return Value
  - The function returns a promise containing the result of the tracking request, which is a part of the baseIterableRequest function.
- Behavior
  - The function constructs a POST request to the server endpoint /embedded-messaging/events/session.
  - It packages the session data in the request payload.
  - The function performs validation of the request payload using the embaddedMessagingSessionSchema schema.
  - The request is sent to the server for analysis.
- Example
```ts
const sessionData = {
      [Functions.checkEmailValidation(userId) ? 'email' : 'userId']: userId,
      session: {
        id: 'abcd123',
        start: startTime.getTime(),
        end: Date.now()
      },
      impressions: [
        {
          messageId: messageId,
          displayCount: 1,
          displayDuration: 1000
        }
      ],
      deviceInfo: {
        deviceId:
          'Chrome/119.0.0.0 Safari/537.36',
        platform: 'Web',
        appPackageName: 'my-lil-site'
      },
      createdAt: Date.now()
    };

    trackEmbeddedMessagingSession(sessionData)
      .then((response) => {
         console.log('Message session tracking successful:', response);
      })
      .catch((error) => {
        console.error('Error tracking message session:', error);
      });
```