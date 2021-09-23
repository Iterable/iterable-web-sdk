import Axios, { AxiosRequestConfig } from 'axios';
import { IterablePromise } from './types';
import { BASE_URL } from './constants';

export const baseAxiosRequest = Axios.create({
  baseURL: BASE_URL
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
  EventsApiController.track
  CommerceApiController.trackPurchase
  CommerceApiController.updateCart
  UsersApiController.updateSubscriptions
  
  todo:
  UsersApiController.disableDevice
  UsersApiController.registerDeviceToken
  EventsApiController.trackPushOpen
  EventsApiController.trackInboxSession
  MobileApiController.getRemoteConfiguration
*/
