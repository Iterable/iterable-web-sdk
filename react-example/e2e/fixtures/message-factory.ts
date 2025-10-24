/**
 * Factory for creating in-app message payloads
 * Follows Playwright best practices - DRY, reusable, maintainable
 */

import { MessageTemplates } from './message-templates';

export interface InAppMessage {
  messageId: string;
  campaignId: number;
  createdAt: number;
  expiresAt: number;
  content: {
    html: string;
    payload: Record<string, unknown>;
    inAppDisplaySettings: {
      top: { displayOption: string };
      right: { percentage: number };
      bottom: { displayOption: string };
      left: { percentage: number };
      shouldAnimate: boolean;
      bgColor?: { alpha: number; hex: string };
    };
    webInAppDisplaySettings: { position: string };
  };
  customPayload: Record<string, unknown>;
  trigger: { type: string };
  saveToInbox: boolean;
  inboxMetadata: {
    title: string;
    subtitle: string;
    icon: string;
  };
  priorityLevel: number;
  read: boolean;
  jsonOnly: boolean;
  typeOfContent: string;
  messageType: string;
}

const defaultDisplaySettings = {
  top: { displayOption: 'AutoExpand' },
  right: { percentage: 0 },
  bottom: { displayOption: 'AutoExpand' },
  left: { percentage: 0 },
  shouldAnimate: true
};

export class MessageFactory {
  static createHelloFreshWeeklyMenu(): InAppMessage {
    return {
      messageId: 'hellofresh-weekly-menu',
      campaignId: 80001,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 7,
      content: {
        html: MessageTemplates.hellofresh.weeklyMenu,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'HelloFresh',
        messageType: 'weekly_menu',
        recipeCount: 100
      },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: 'Weekly Menu',
        subtitle: '100+ recipes',
        icon: 'https://cdn.hellofresh.com/icons/menu.png'
      },
      priorityLevel: 300.5,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createHelloFreshDeliveryReminder(isRead = false): InAppMessage {
    return {
      messageId: 'hellofresh-delivery',
      campaignId: 80002,
      createdAt: Date.now() - 86400000,
      expiresAt: Date.now() + 86400000,
      content: {
        html: MessageTemplates.hellofresh.deliveryReminder,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'HelloFresh',
        messageType: 'delivery_reminder',
        deliveryWindow: '8AM-8PM'
      },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: 'Box Arrives Tomorrow',
        subtitle: 'Delivery reminder',
        icon: ''
      },
      priorityLevel: 300.5,
      read: isRead,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createHelloFreshRecipeTips(): InAppMessage {
    return {
      messageId: 'hellofresh-tips',
      campaignId: 80003,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      content: {
        html: MessageTemplates.hellofresh.recipeTips,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'HelloFresh',
        messageType: 'recipe_tips'
      },
      trigger: { type: 'immediate' },
      saveToInbox: false,
      inboxMetadata: { title: '', subtitle: '', icon: '' },
      priorityLevel: 300.5,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createPricelineFlightAlert(): InAppMessage {
    return {
      messageId: 'priceline-flight-alert',
      campaignId: 90001,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      content: {
        html: MessageTemplates.priceline.flightAlert,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'Priceline',
        messageType: 'price_drop_alert',
        destination: 'Paris',
        priceWas: 899,
        priceNow: 679,
        savingsAmount: 220
      },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: 'Price Drop - Paris',
        subtitle: 'Save $220',
        icon: 'https://cdn.priceline.com/icons/flight.png'
      },
      priorityLevel: 300.5,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createPricelineHotelDeal(priority: number): InAppMessage {
    return {
      messageId: 'priceline-hotel-deal',
      campaignId: 90002,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      content: {
        html: MessageTemplates.priceline.hotelDeal,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'Priceline',
        messageType: 'hotel_flash_sale',
        city: 'NYC',
        savingsPercent: 40
      },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: 'NYC Hotel Flash Sale',
        subtitle: 'Save 40%',
        icon: ''
      },
      priorityLevel: priority,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createPricelineTopBanner(): InAppMessage {
    return {
      messageId: 'priceline-top-banner',
      campaignId: 90003,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7200000, // 2 hours
      content: {
        html: MessageTemplates.priceline.topBanner,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Top' }
      },
      customPayload: {
        customer: 'Priceline',
        messageType: 'flash_sale_banner',
        urgency: 'high'
      },
      trigger: { type: 'immediate' },
      saveToInbox: false,
      inboxMetadata: { title: '', subtitle: '', icon: '' },
      priorityLevel: 200.5,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createPricelineFullScreen(): InAppMessage {
    return {
      messageId: 'priceline-vip-upgrade',
      campaignId: 90004,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 7,
      content: {
        html: MessageTemplates.priceline.fullScreen,
        payload: {},
        inAppDisplaySettings: {
          ...defaultDisplaySettings,
          bgColor: { alpha: 0.9, hex: '#000000' }
        },
        webInAppDisplaySettings: { position: 'Full' }
      },
      customPayload: {
        customer: 'Priceline',
        messageType: 'vip_upgrade',
        tier: 'VIP'
      },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: 'Upgrade to VIP',
        subtitle: 'Exclusive benefits',
        icon: ''
      },
      priorityLevel: 250.5,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createPriorityMessage(
    level: 'critical' | 'high' | 'medium' | 'low',
    customer: 'hellofresh' | 'priceline'
  ): InAppMessage {
    const priorityMap = {
      critical: 100.5,
      high: 200.5,
      medium: 300.5,
      low: 400.5
    };

    const titles = {
      critical: { hellofresh: 'Account Issue', priceline: 'Verify Booking' },
      high: { hellofresh: 'Box Ships Today', priceline: 'Booking Confirmed' },
      medium: {
        hellofresh: 'New Recipes Added',
        priceline: 'Price Drop Alert'
      },
      low: { hellofresh: 'Blog Post', priceline: 'Travel Tips' }
    };

    const campaignIdMap = {
      critical: 70000,
      high: 70001,
      medium: 70002,
      low: 70003
    };

    return {
      messageId: `${customer}-${level}`,
      campaignId: campaignIdMap[level],
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      content: {
        html: MessageTemplates.priority[level],
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: { customer, priority: level },
      trigger: { type: 'immediate' },
      saveToInbox: true,
      inboxMetadata: {
        title: titles[level][customer],
        subtitle: `${level} priority`,
        icon: ''
      },
      priorityLevel: priorityMap[level],
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }

  static createCarRental(priority: number): InAppMessage {
    return {
      messageId: 'priceline-car-rental',
      campaignId: 90005,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      content: {
        html: `
          <html>
            <head>
              <style>
                body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
                .icon { font-size: 40px; text-align: center; margin-bottom: 15px; }
                h3 { color: #0068EF; text-align: center; margin: 0 0 10px 0; }
                .code { background: #f8f9fa; padding: 12px; border: 2px dashed #0068EF; border-radius: 6px; text-align: center; font-weight: bold; margin: 15px 0; }
                button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
              </style>
            </head>
            <body>
              <div class="icon">🚗</div>
              <h3>Car Rental: Save 20%</h3>
              <p style="text-align: center;">Use promo code</p>
              <div class="code">PROMO20</div>
              <button>✕</button>
            </body>
          </html>
        `,
        payload: {},
        inAppDisplaySettings: defaultDisplaySettings,
        webInAppDisplaySettings: { position: 'Center' }
      },
      customPayload: {
        customer: 'Priceline',
        messageType: 'car_rental_promo',
        discountPercent: 20,
        promoCode: 'PROMO20'
      },
      trigger: { type: 'immediate' },
      saveToInbox: false,
      inboxMetadata: { title: '', subtitle: '', icon: '' },
      priorityLevel: priority,
      read: false,
      jsonOnly: false,
      typeOfContent: 'Dynamic',
      messageType: 'Web'
    };
  }
}
