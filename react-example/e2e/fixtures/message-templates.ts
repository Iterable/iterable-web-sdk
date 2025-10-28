/**
 * HTML templates for in-app message testing
 * Inspired by real customer use cases (HelloFresh, Priceline)
 */

export const MessageTemplates = {
  hellofresh: {
    weeklyMenu: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; }
            .header { background: linear-gradient(135deg, #91C963 0%, #5FA52F 100%); color: white; padding: 30px; text-align: center; }
            h1 { margin: 0 0 8px 0; font-size: 28px; }
            .subtitle { font-size: 14px; opacity: 0.9; }
            .content { padding: 25px; }
            .promo { background: #FFF8E1; padding: 12px; border-radius: 6px; margin: 15px 0; text-align: center; color: #F57C00; font-weight: 600; }
            .cta-btn { display: block; padding: 14px; background: #91C963; color: white; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600; }
            button { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.15); border: none; color: white; font-size: 20px; cursor: pointer; border-radius: 50%; width: 32px; height: 32px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍽️ This Week's Menu</h1>
            <div class="subtitle">100+ chef-curated recipes</div>
          </div>
          <div class="content">
            <p style="text-align: center; margin: 15px 0;">Fresh ingredients delivered to your door</p>
            <div class="promo">🎉 New Customers: Get 10 Free Meals!</div>
            <a href="/menu" class="cta-btn">View Full Menu</a>
          </div>
          <button>✕</button>
        </body>
      </html>
    `,

    deliveryReminder: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
            .icon { font-size: 48px; text-align: center; margin-bottom: 15px; }
            h2 { text-align: center; color: #2c3e50; margin: 0 0 10px 0; }
            p { text-align: center; color: #5a6c7d; line-height: 1.6; }
            .time { background: #91C963; color: white; padding: 10px; border-radius: 6px; text-align: center; font-weight: 600; margin: 15px 0; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <div class="icon">📦</div>
          <h2>Your Box Arrives Tomorrow!</h2>
          <p>Get ready for delicious meals</p>
          <div class="time">Delivery Window: 8 AM - 8 PM</div>
          <button>✕</button>
        </body>
      </html>
    `,

    recipeTips: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f8f9fa; padding: 25px; }
            h2 { color: #5FA52F; margin: 0 0 15px 0; }
            .tip { background: white; padding: 12px; margin: 8px 0; border-left: 3px solid #91C963; border-radius: 4px; }
            button { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.1); border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <h2>🍴 Chef's Tips</h2>
          <div class="tip">Perfect sear: Pat meat dry first</div>
          <div class="tip">Fresh herbs: Add at the end</div>
          <div class="tip">Season gradually and taste</div>
          <button>✕</button>
        </body>
      </html>
    `
  },

  priceline: {
    flightAlert: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; }
            .header { background: linear-gradient(135deg, #0068EF 0%, #0052CC 100%); color: white; padding: 25px; text-align: center; }
            .icon { font-size: 40px; margin-bottom: 10px; }
            h1 { margin: 0; font-size: 24px; }
            .content { padding: 25px; }
            .price-drop { background: #FFB200; color: #2c3e50; padding: 12px; border-radius: 6px; text-align: center; font-weight: bold; margin: 15px 0; }
            .price-new { color: #0068EF; font-size: 28px; font-weight: bold; }
            .cta-btn { display: block; padding: 14px; background: #0068EF; color: white; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600; }
            button { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 20px; cursor: pointer; border-radius: 50%; width: 32px; height: 32px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="icon">✈️</div>
            <h1>Price Drop Alert!</h1>
          </div>
          <div class="content">
            <div class="price-drop">Save $220 on Flights to Paris</div>
            <p>JFK → CDG | June 15-22, 2025</p>
            <div class="price-new">$679</div>
            <p style="text-decoration: line-through; color: #999;">Was $899</p>
            <a href="/flights/paris" class="cta-btn">Book This Flight</a>
          </div>
          <button>✕</button>
        </body>
      </html>
    `,

    hotelDeal: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
            .badge { display: inline-block; background: #DC3545; color: white; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            h2 { color: #2c3e50; margin: 10px 0; }
            .savings { color: #0068EF; font-size: 24px; font-weight: bold; }
            .cta-btn { display: block; padding: 12px; background: #0068EF; color: white; text-decoration: none; border-radius: 6px; text-align: center; margin-top: 15px; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <div class="badge">FLASH SALE</div>
          <h2>🏨 NYC 4-Star Hotel</h2>
          <p>This weekend only</p>
          <div class="savings">Save up to 40%</div>
          <a href="/hotels/nyc" class="cta-btn">Book Now</a>
          <button>✕</button>
        </body>
      </html>
    `,

    topBanner: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #DC3545; color: white; padding: 20px; text-align: center; }
            h3 { margin: 0 0 8px 0; font-size: 20px; }
            .timer { font-size: 24px; font-weight: bold; }
            button { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <h3>⚡ Flash Sale Ends Soon!</h3>
          <div class="timer">2 Hours Left</div>
          <button>✕</button>
        </body>
      </html>
    `,

    fullScreen: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; }
            .vip-badge { color: #FFB200; font-size: 48px; margin-bottom: 15px; }
            h1 { margin: 0 0 15px 0; font-size: 32px; }
            .benefits { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; }
            .benefit { margin: 10px 0; }
            .upgrade-btn { display: inline-block; padding: 16px 40px; background: #FFB200; color: #1a1a2e; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
            button { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 20px; cursor: pointer; border-radius: 50%; width: 32px; height: 32px; }
          </style>
        </head>
        <body>
          <div class="vip-badge">👑</div>
          <h1>Unlock VIP Benefits</h1>
          <div class="benefits">
            <div class="benefit">✓ Exclusive deals up to 60% off</div>
            <div class="benefit">✓ Priority customer support</div>
            <div class="benefit">✓ Free cancellations</div>
          </div>
          <a href="/vip-upgrade" class="upgrade-btn">Upgrade Now</a>
          <button>✕</button>
        </body>
      </html>
    `
  },

  priority: {
    critical: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
            .alert { background: #DC3545; color: white; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 15px; }
            h2 { color: #DC3545; margin: 10px 0; }
            .cta-btn { display: block; padding: 12px; background: #DC3545; color: white; text-decoration: none; border-radius: 6px; text-align: center; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <div class="alert">⚠️ ACTION REQUIRED</div>
          <h2>Verify Your Booking</h2>
          <p>We need to confirm your reservation details</p>
          <a href="/bookings/verify" class="cta-btn">Verify Now</a>
          <button>✕</button>
        </body>
      </html>
    `,

    high: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
            .icon { font-size: 48px; text-align: center; margin-bottom: 15px; }
            h2 { color: #5FA52F; text-align: center; margin: 0 0 10px 0; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <div class="icon">📦</div>
          <h2>Your Box Ships Today!</h2>
          <p style="text-align: center;">Track your delivery in real-time</p>
          <button>✕</button>
        </body>
      </html>
    `,

    medium: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f8f9fa; padding: 25px; }
            h3 { color: #0068EF; margin: 0 0 10px 0; }
            .savings { font-size: 20px; font-weight: bold; color: #0068EF; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <h3>💰 Price Drop on Saved Search</h3>
          <p>Tokyo flights now $150 cheaper</p>
          <div class="savings">$530</div>
          <button>✕</button>
        </body>
      </html>
    `,

    low: `
      <html>
        <head>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #fff; padding: 25px; }
            h4 { color: #5FA52F; margin: 0 0 10px 0; }
            p { color: #5a6c7d; line-height: 1.6; }
            button { position: absolute; top: 12px; right: 12px; background: #e0e0e0; border: none; color: #666; font-size: 18px; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; }
          </style>
        </head>
        <body>
          <h4>✨ New Blog Post</h4>
          <p>5-Ingredient Weeknight Dinners</p>
          <button>✕</button>
        </body>
      </html>
    `
  }
};
