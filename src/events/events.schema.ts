import { boolean, number, object, string, array, mixed } from 'yup';

export const trackSchema = object().shape({
  eventName: string().required(),
  id: string(),
  createdAt: number(),
  dataFields: object(),
  campaignId: number(),
  templateId: number()
});

export const eventRequestSchema = object().shape({
  messageId: string().required(),
  clickedUrl: string(),
  messageContext: object().shape({
    saveToInbox: boolean(),
    silentInbox: boolean(),
    location: string()
  }),
  closeAction: string(),
  deviceInfo: object()
    .shape({
      deviceId: string().required(),
      platform: string().required(),
      appPackageName: string().required()
    })
    .required(),
  inboxSessionId: string(),
  createdAt: number()
});
