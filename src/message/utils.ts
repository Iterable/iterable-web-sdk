/* eslint-disable */
import { IMessageService } from './types';
import { baseIterableRequest } from '../request';
import { IterableResponse } from '../types';
import { REGISTER_TOKEN } from '../constants';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

export let fireAppInstance: FirebaseApp;
export let messaging: Messaging;

export const configureMessageService = async (config: IMessageService) => {
  fireAppInstance = initializeApp(config);
  messaging = getMessaging(fireAppInstance);
  await requestPermission(config.vapidkey);
};

const requestPermission = async (vapidKey: string) => {
  Notification.requestPermission().then(async (permission) => {
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: vapidKey });
      if (currentToken) {
        await registerBrowserToken(currentToken);
      } else {
        console.warn('Failed to generate the app registration token.');
      }
    } else {
      console.warn('User Permission Denied.');
    }
  });
};

const registerBrowserToken = async (token: string) => {
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: REGISTER_TOKEN,
    data: {
      browserToken: token
    }
  });
};
