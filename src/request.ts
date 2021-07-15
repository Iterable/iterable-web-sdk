import Axios, { AxiosRequestConfig } from 'axios';
import { IterablePromise } from './types';

export const baseAxiosRequest = Axios.create({
  baseURL: 'https://api.iterable.com/api'
});

/**
  @todo flesh out later when we have client-side validation
*/
export const baseIterableRequest = <T = any>(
  payload: AxiosRequestConfig
): IterablePromise<T> => {
  return baseAxiosRequest(payload);
};

/*
  implemented:
  UsersApiController.updateUser
  UsersApiController.updateEmail
  InAppApiController.getMessages(email = None, userId = None, count = 0)
  EventsApiController.trackInAppOpen
  EventsApiController.trackInAppClick
  EventsApiController.trackInAppClose
  EventsApiController.inAppConsume
  EventsApiController.trackInAppDelivery
  
  todo:
  UsersApiController.disableDevice
  UsersApiController.registerDeviceToken
  UsersApiController.updateSubscriptions
  CommerceApiController.trackPurchase
  CommerceApiController.updateCart
  EventsApiController.trackPushOpen
  EventsApiController.trackInboxSession
  EventsApiController.track
  MobileApiController.getRemoteConfiguration
*/
