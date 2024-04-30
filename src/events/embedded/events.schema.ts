import { boolean, number, object, string, array, mixed } from 'yup';

export const trackEmbeddedSchema = object().shape({
  metadata: object().shape({
    messageId: string(),
    campaignId: number(),
    isProof: boolean(),
    placementId: number()
  }),
  elements: object().shape({
    title: string(),
    body: string(),
    mediaUrl: string(),
    buttons: array().of(
      object().shape({
        id: string(),
        title: string(),
        action: object().shape({
          type: string(),
          data: string()
        })
      })
    ),
    text: array().of(
      object().shape({
        id: string(),
        text: string()
      })
    ),
    defaultAction: array().of(
      object().shape({
        type: string(),
        data: string()
      })
    )
  }),
  payload: array().of(mixed())
});

export const trackEmbeddedClickSchema = object().shape({
  messageId: string(),
  buttonIdentifier: string(),
  targetUrl: string(),
  deviceInfo: object().shape({
    appPackageName: string()
  })
});

export const embaddedDismissSchema = object().shape({
  messageId: string().required(),
  buttonIdentifier: string(),
  deviceInfo: object().shape({
    deviceId: string().required(),
    platform: string().required(),
    appPackageName: string().required()
  }),
  createdAt: number()
});

export const embaddedSessionSchema = object().shape({
  session: object()
    .shape({
      id: string().required(),
      start: number().required(),
      end: number().required()
    })
    .required(),
  impressions: array().of(
    object().shape({
      messageId: string().required(),
      displayCount: number().required(),
      displayDuration: number().required(),
      placementId: string()
    })
  ),
  deviceInfo: object().shape({
    deviceId: string().required(),
    platform: string().required(),
    appPackageName: string().required()
  }),
  createdAt: number()
});
