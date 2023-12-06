import { boolean, number, object, string, array, mixed, date } from 'yup';

export const trackEmbeddedMessageSchema = object().shape({
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

export const trackEmbeddedMessageClickSchema = object().shape({
  messageId: string(),
  buttonIdentifier: string(),
  targetUrl: string(),
  deviceInfo: object().shape({
    appPackageName: string()
  })
});

export const trackEmbeddedSessionSchema = object().shape({
  start: date(),
  end: date(),
  placementId: string(),
  impressions: array().of(
    object().shape({
      messageId: string(),
      displayCount: number(),
      duration: number()
    })
  ),
  id: string()
});

export const embaddedMessagingDismissSchema = object().shape({
  email: string(),
  userId: string(),
  messageId: string().required(),
  buttonIdentifier: string(),
  deviceInfo: object().shape({
    deviceId: string().required(),
    platform: string().required(),
    appPackageName: string().required()
  }),
  createdAt: number()
});

export const embaddedMessagingSessionSchema = object().shape({
  userId: string().required(),
  session: object()
    .shape({
      id: string().required(),
      start: string().required(),
      end: string().required()
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
