import { IMessageService } from './types';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import { REGISTER_TOKEN } from '../constants';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

export class PMessaging {
  private fireAppInstance: FirebaseApp;
  private messaging: Messaging;
  private listeners: Array<Function>;
  private userId: string;

  constructor(config: IMessageService) {
    this.fireAppInstance = initializeApp(config);
    this.messaging = getMessaging(this.fireAppInstance);
    this.requestPermission(config.vapidkey);
    this.listeners = [];
    this.userId = "";

    onMessage(this.messaging, (payload: any) => {
      this.triggerEvent(payload);
    });
  }

  public addEventListener(callback: Function) {
    this.listeners.push(callback);
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  private triggerEvent(eventData: any) {
    if (this.listeners.length) {
      this.listeners.forEach((callback: Function) => callback(eventData));
    }
  }

  private async requestPermission (vapidKey: string) {
    let me = this;
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        const currentToken = await getToken(me.messaging, { vapidKey: vapidKey });
        if (currentToken) {
          await me.registerBrowserToken(currentToken);
        } else {
          console.warn('Failed to generate the app registration token.');
        }
      } else {
        console.warn('User Permission Denied.');
      }
    });
  };
  
  private async registerBrowserToken (token: string) {
    return baseIterableRequest<IterableResponse>({
      method: 'POST',
      url: REGISTER_TOKEN,
      headers: {
        "Api-Key": "1d925bbf54f34bcb92a15da14bfb5d1d"
      },
      data: {
        userId: this.userId,
        browserToken: token
      }
    });
  };
}
