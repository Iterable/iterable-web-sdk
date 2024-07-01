import { DisplayPosition, InAppMessage } from '../inapp/types';

const normalMessage: InAppMessage = {
  messageId: 'normalMessage!',
  campaignId: 2642276,
  createdAt: 1627060811283,
  expiresAt: 1670355237175,
  content: {
    html: `<html>\n<head>\n\t<title></title>\n\t<meta name="viewport" content="width=device-width, 
    initial-scale=1, viewport-fit=cover"/>\n\t
    <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/fonts.css" 
    rel="stylesheet" />\n\t
    <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/iterable-templates.css" 
    rel="stylesheet" />\n</head>\n<body>\n<div class="overlay"></div>\n\n
    <div class="modal-container" style="margin: auto; width: 70%; 
    border: 1px dashed black; padding: 10px;background:#ffffff">\n<h2>Hey ,</h2>\n\n
    <p>This is a sample In App message, how are you?</p>\n
    <a href="iterable://dismiss">close</a> 
    <a href="action://close-first-iframe">profile</a>
    <input type="text" /></div>\n</body>\n</html>\n`,
    payload: {},
    inAppDisplaySettings: {
      top: {
        displayOption: 'AutoExpand'
      },
      right: {
        percentage: 0
      },
      bottom: {
        displayOption: 'AutoExpand'
      },
      left: {
        percentage: 0
      }
    },
    webInAppDisplaySettings: {
      position: DisplayPosition.Center
    }
  },
  customPayload: {},
  trigger: {
    type: 'immediate'
  },
  saveToInbox: true,
  inboxMetadata: {
    title: 'hey there',
    subtitle: 'mensaje',
    icon: ''
  },
  priorityLevel: 300.5,
  read: false
};

const expiredMessage: InAppMessage = {
  messageId: 'expiredMessage!',
  campaignId: 2641072,
  createdAt: 1627320168381,
  expiresAt: 1635096168381,
  content: {
    html: `<html>\n<head>\n\t<title></title>\n\t<meta name="viewport" content="width=device-width, 
    initial-scale=1, viewport-fit=cover"/>\n\t
    <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/fonts.css" 
    rel="stylesheet" />\n\t
    <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/iterable-templates.css" 
    rel="stylesheet" />\n</head>\n<body>\n<div class="overlay"></div>\n\n
    <div class="modal-container" style="margin: auto; width: 70%; 
    border: 1px dashed black; padding: 10px;background:#ffffff">\n<h2>Hey ,</h2>\n\n
    <p>This is a sample In App message, how are you?</p>\n
    <a href="iterable://dismiss">close</a> 
    <a href="action://close-second-iframe">profile</a>
    <input type="text" /></div>\n</body>\n</html>\n`,
    payload: {
      eventName: 'DailyRewardScreen',
      event: 'screen'
    },
    inAppDisplaySettings: {
      top: {
        displayOption: 'AutoExpand'
      },
      right: {
        percentage: 0
      },
      bottom: {
        displayOption: 'AutoExpand'
      },
      left: {
        percentage: 0
      }
    },
    webInAppDisplaySettings: {
      position: DisplayPosition.Center
    }
  },
  customPayload: {
    eventName: 'DailyRewardScreen',
    event: 'screen'
  },
  trigger: {
    type: 'immediate'
  },
  inboxMetadata: {
    title: 'hey there',
    subtitle: 'mensaje',
    icon: ''
  },
  saveToInbox: false,
  priorityLevel: 300.5,
  read: false
};

const previouslyCachedMessage: InAppMessage = {
  messageId: 'previouslyCachedMessage!',
  campaignId: 2632531,
  createdAt: 1627332441416,
  expiresAt: 1670355237175,
  content: {
    html: `<html>\n<head>\n\t<title></title>\n\t<meta name="viewport" content="width=device-width,
      initial-scale=1, viewport-fit=cover"/>\n\t
      <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/fonts.css"
      rel="stylesheet" />\n\t
      <link href="https://storage.googleapis.com/publicstatic.hellobrigit.com/iterable-templates.css"
      rel="stylesheet" />\n</head>\n<body>\n<div class="overlay"></div>\n\n
      <div class="modal-container" style="margin: auto; width: 70%;
      border: 1px dashed black; padding: 10px;background:#ffffff">\n<h2>Hey ,</h2>\n\n
      <p>This is a sample In App message, how are you?</p>\n
      <a href="iterable://dismiss">close</a>
      <a href="action://close-third-iframe">profile</a>
      <input type="text" /></div>\n</body>\n</html>\n`,
    payload: {},
    inAppDisplaySettings: {
      top: {
        percentage: 0
      },
      right: {
        percentage: 0
      },
      bottom: {
        percentage: 0
      },
      left: {
        percentage: 0
      },
      bgColor: {
        alpha: 0.6,
        hex: '#a2e3ff'
      },
      shouldAnimate: true
    },
    webInAppDisplaySettings: {
      position: DisplayPosition.Center
    }
  },
  customPayload: {},
  trigger: {
    type: 'immediate'
  },
  saveToInbox: true,
  inboxMetadata: {
    title: 'wev',
    subtitle: 'brtbrtb',
    icon: ''
  },
  priorityLevel: 300.5,
  read: false
};

export const messages: InAppMessage[] = [
  normalMessage,
  expiredMessage,
  previouslyCachedMessage
  // { messageId: 'previouslyCachedMessage!' }
];
