import { array, boolean, number, object } from 'yup';

export const updateUserSchema = object().shape({
  dataFields: object(),
  preferUserId: boolean(),
  mergeNestedObjects: boolean()
});

export const updateSubscriptionsSchema = object().shape({
  emailListIds: array(number()),
  unsubscribedChannelIds: array(number()),
  unsubscribedMessageTypeIds: array(number()),
  subscribedMessageTypeIds: array(number()),
  campaignId: number(),
  templateId: number()
});
