import Axios from 'axios';

export const baseRequest = Axios.create({
  baseURL: 'https://api.iterable.com/api'
});

/*
  UsersApiController.updateUser
  UsersApiController.updateEmail
  InAppApiController.getMessages(email = None, userId = None, count = 0)
  
  UsersApiController.disableDevice
  UsersApiController.registerDeviceToken
  UsersApiController.updateSubscriptions
  CommerceApiController.trackPurchase
  CommerceApiController.updateCart
  EventsApiController.trackPushOpen
  EventsApiController.trackInAppOpen
  EventsApiController.trackInAppClick
  EventsApiController.trackInAppClose
  EventsApiController.trackInAppDelivery
  EventsApiController.trackInboxSession
  EventsApiController.inAppConsume
  EventsApiController.track
  MobileApiController.getRemoteConfiguration
*/
