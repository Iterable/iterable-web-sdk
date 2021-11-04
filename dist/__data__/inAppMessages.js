(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.inAppMessages = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.messages = void 0;
  const messages = [{
    messageId: 'Dbld4KEgeUMXneIbBW5uauvuLQ0Ngmcme6WUxxX0lX6G',
    campaignId: 2642276,
    createdAt: 1627060811283,
    expiresAt: 1635108441416,
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
        position: 'Center'
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
  }, {
    messageId: 'GL1EXnB9Jt1R79fJqNwHBudu9ELdx0HA2L7cEEkVnmnE',
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
        position: 'Center'
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
  }, {
    messageId: 'xEA5MZmz8T2pAoi1VJ5hRuDuazdZzXS9BD85t00w0r9ax',
    campaignId: 2632531,
    createdAt: 1627332441416,
    expiresAt: 1634836811283,
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
        position: 'Center'
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
  }];
  _exports.messages = messages;
});