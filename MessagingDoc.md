# Iterable's Messaging Integration

Firebase Messaging Service is a powerful cloud-based messaging platform that enables developers to send notifications and messages to users across various platforms, including web, mobile, and desktop. we are offering integration of Firebase Messaging Service through Iterable's Web SDK, and allowing developers to harness the full potential of Firebase Message in their web applications.

# Installation

To install this SDK through NPM:

```
$ npm install @iterable/web-sdk
```

with yarn:

```
$ yarn add @iterable/web-sdk
```

or with a CDN:

Configure Firebase
https://support.iterable.com/hc/en-us/articles/115004760086-Web-Push-Overview-#configuring-firebase


Add firebase-messaging-sw.js file to app's public folder
https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js


# Example

```ts
import { configureMessageService, fireAppInstance, messaging } from '@iterable/web-sdk';

function App() {

    React.useEffect(() => {
        const init = async () => {
            await configureMessageService({
                apiKey: string,
                authDomain: string,
                projectId: string,
                storageBucket: string,
                messagingSenderId: string,
                appId: string,
                vapidkey: string,
            });

            console.log("initialized", fireAppInstance, messaging)
        }

        init();
    }, []);
}
```

# Methods

## configureMessageService(config)

This method will take firebase config params, which is available on firebase account at the time of project creation,
and one more param vapidkey is also required, to subscribe to fcm service of firebase to send push notification

```
apiKey: string
authDomain: string
projectId: string
storageBucket: string
messagingSenderId: string
appId: string
vapidkey: string // public key
```

# Properties

## fireAppInstance

Firebase App Instance is a powerful and versatile feature that allows developers to uniquely identify
and target individual app installations across different devices and platforms. It provides a simple 
and efficient way to engage with users and deliver personalized experiences within the context of specific app installation.

## messaging

Firebase Messaging Instance is a key component of Firebase Cloud Messaging (FCM), 
Google's cloud-based messaging platform that enables developers to send real-time notifications 
and messages to users across various devices and platforms. The Messaging Instance is a unique representation of an app's registration with FCM, 
providing developers with the necessary tools to manage and send messages to specific devices or user groups seamlessly
