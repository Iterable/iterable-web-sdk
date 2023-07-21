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

  constructor(config: IMessageService) {
    this.fireAppInstance = initializeApp(config);
    this.messaging = getMessaging(this.fireAppInstance);
    this.requestPermission(config.vapidkey);
    this.listeners = [];

    onMessage(this.messaging, (payload: any) => {
      this.triggerEvent(payload);
    });
  }

  public addEventListener(callback: Function) {
    this.listeners.push(callback);
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
      data: {
        browserToken: token
      }
    });
  };
}
