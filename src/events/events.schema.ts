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

export const trackEmbeddedMessageSchema = object().shape({
  messageId: string(),
  userId: string(),
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
  payload: array().of(mixed()),
  deviceInfo: object()
    .shape({
      deviceId: string().required(),
      platform: string().required(),
      appPackageName: string().required()
    })
    .required()
});

export const trackEmbeddedMessageClickSchema = object().shape({
  email: string(),
  userId: string(),
  messageId: string().required(),
  buttonIdentifier: string(),
  targetUrl: string(),
  deviceInfo: object()
    .shape({
      deviceId: string().required(),
      platform: string().required(),
      appPackageName: string().required()
    })
    .required(),
  createdAt: number().required()
});

// export const trackEmbeddedSessionSchema = object().shape({
//   session: object().shape({
//     start: number(),
//     end: number(),
//     id: string()
//   }),
//   placementId: string(),
//   impressions: array().of(
//     object().shape({
//       messageId: string(),
//       displayCount: number(),
//       duration: number()
//     })
//   ),
//   deviceInfo: object()
//     .shape({
//       deviceId: string().required(),
//       platform: string().required(),
//       appPackageName: string().required()
//     })
//     .required()
// });

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
  email: string(),
  userId: string(),
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
