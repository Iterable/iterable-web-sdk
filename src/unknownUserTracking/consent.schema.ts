import { boolean, number, object, string } from 'yup';

export const consentRequestSchema = object().shape({
  consentTimestamp: number().required(),
  email: string(),
  userId: string(),
  isUserKnown: boolean().required(),
  deviceInfo: object()
    .shape({
      deviceId: string().required(),
      platform: string().required(),
      appPackageName: string().required()
    })
    .required()
});
