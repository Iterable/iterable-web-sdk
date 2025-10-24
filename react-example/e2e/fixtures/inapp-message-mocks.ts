/**
 * Mock message payloads for in-app message testing
 *
 * These are raw InAppMessage objects used for tests that need precise control
 * over message structure without using the MessageFactory.
 */

import { InAppMessage } from '@iterable/web-sdk';

/**
 * Simple messages for position testing
 */
export const PositionTestMessages = {
  topRight: (): InAppMessage => ({
    messageId: 'topright-test',
    campaignId: 70001,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 20px; background: white; }</style></head>
          <body>
            <h3>TopRight Message</h3>
            <p>This should appear in top-right corner</p>
            <button style="position: absolute; top: 8px; right: 8px;">✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'TopRight' }
    },
    customPayload: {},
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Test', subtitle: '', icon: '' },
    priorityLevel: 350.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  }),

  bottomRight: (): InAppMessage => ({
    messageId: 'bottomright-test',
    campaignId: 70002,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 20px; background: white; }</style></head>
          <body>
            <h3>BottomRight Message</h3>
            <p>This should appear in bottom-right corner</p>
            <button style="position: absolute; top: 8px; right: 8px;">✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'BottomRight' }
    },
    customPayload: {},
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Test', subtitle: '', icon: '' },
    priorityLevel: 300.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  }),

  bottom: (): InAppMessage => ({
    messageId: 'bottom-banner',
    campaignId: 60008,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000 * 365,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 15px; background: #f5f5f5; text-align: center; }</style></head>
          <body>
            <p>Bottom Banner Content</p>
            <button style="position: absolute; top: 5px; right: 5px;">✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: false
      },
      webInAppDisplaySettings: { position: 'Bottom' }
    },
    customPayload: {},
    trigger: { type: 'immediate' },
    saveToInbox: false,
    inboxMetadata: { title: '', subtitle: '', icon: '' },
    priorityLevel: 500.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  })
};

/**
 * Messages for URL handling tests
 */
export const URLHandlingMessages = {
  iterableDismiss: (): InAppMessage => ({
    messageId: 'iterable-dismiss-url',
    campaignId: 70003,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 20px; background: white; }</style></head>
          <body>
            <h2>Test Dismiss URL</h2>
            <a href="iterable://dismiss" class="dismiss-link" data-qa-original-link="iterable://dismiss">Dismiss</a>
            <button>✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'Center' }
    },
    customPayload: {},
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Test', subtitle: '', icon: '' },
    priorityLevel: 300.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  }),

  actionURL: (): InAppMessage => ({
    messageId: 'action-url',
    campaignId: 70004,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 20px; background: white; }</style></head>
          <body>
            <h2>Test Action URL</h2>
            <a href="action://navigate-home" class="action-link" data-qa-original-link="action://navigate-home">Go Home</a>
            <button>✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'Center' }
    },
    customPayload: { action: 'navigate-home' },
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Test', subtitle: '', icon: '' },
    priorityLevel: 300.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  })
};

/**
 * Messages for close button feature tests
 */
export const CloseButtonMessages = {
  requiredDismiss: (): InAppMessage => ({
    messageId: 'required-dismiss',
    campaignId: 80002,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 30px; background: white; text-align: center; }</style></head>
          <body>
            <h2>Important Message</h2>
            <p>You must click the button to dismiss this message</p>
            <button id="close-btn" style="position: absolute; top: 10px; right: 10px; background: #007bff; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Got It</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'Center' }
    },
    customPayload: { requiresDismiss: true },
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Important', subtitle: '', icon: '' },
    priorityLevel: 100.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  }),

  customStyling: (): InAppMessage => ({
    messageId: 'custom-close-button',
    campaignId: 80003,
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000,
    content: {
      html: `
        <html>
          <head><style>body { margin: 0; padding: 30px; background: white; }</style></head>
          <body>
            <h2>Custom Close Button</h2>
            <p>Testing custom button styling</p>
            <button style="position: absolute; top: 20px; right: 20px; background: #ff0000; border: none; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 24px; cursor: pointer;">✕</button>
          </body>
        </html>
      `,
      payload: {},
      inAppDisplaySettings: {
        top: { displayOption: 'AutoExpand' },
        right: { percentage: 0 },
        bottom: { displayOption: 'AutoExpand' },
        left: { percentage: 0 },
        shouldAnimate: true
      },
      webInAppDisplaySettings: { position: 'Center' }
    },
    customPayload: {},
    trigger: { type: 'immediate' },
    saveToInbox: true,
    inboxMetadata: { title: 'Test', subtitle: '', icon: '' },
    priorityLevel: 300.0,
    read: false,
    jsonOnly: false,
    typeOfContent: 'Dynamic',
    messageType: 'Web'
  })
};
