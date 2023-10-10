import { number, object, string } from 'yup';

export const trackSchema = object().shape({
  eventName: string().required(),
  id: string(),
  createdAt: number(),
  dataFields: object(),
  campaignId: number(),
  templateId: number()
});
