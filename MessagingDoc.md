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
import { PMessaging } from '@iterable/web-sdk';

function App() {

    React.useEffect(() => {
        const init = async () => {
            await initialize(process.env.API_KEY);
            
            const PMObject = new PMessaging({
                apiKey: "AIzaSyBQ_MAq2O-lTxq7eHGfn_H1_u9j9b0JgZU",
                authDomain: "iterable-web-sdk.firebaseapp.com",
                projectId: "iterable-web-sdk",
                storageBucket: "iterable-web-sdk.appspot.com",
                messagingSenderId: "254172754825",
                appId: "1:254172754825:web:71536f92e90c2a5969e758",
                vapidkey: "BKab2TK0UC8jpQRWHRVXkb58MXGMJE6KidcuUxIUIvPHME3il_JXImADp7_JKdU7ViU0TLOiu4yt_DRaMbugEoc",
            });

            PMObject.setUserId("user1234");

            PMObject.addEventListener((data: any) => {
                console.log("On-Message Triggered", data);
            });
        }

        init();
    }, []);
}
```

By passing configuration params, initialize PMessaging instance which internally create instace of firebase app and messaging module, 
Listene push notifications by adding listener using PMObject.addEventListener(callback).