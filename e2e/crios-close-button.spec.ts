/**
 * WebKit regression for Chrome on iOS.
 *
 * The Jest coverage stubs the iframe probe, because jsdom runs listeners
 * inside a sandboxed iframe. This loads the built bundle in real WebKit
 * with a CriOS user agent, which fails the Safari user-agent check, and
 * asserts the SDK close button is painted on the parent page.
 *
 * Requires index.js. Run `yarn webpack` first.
 */
import fs from 'fs';
import http from 'http';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';

const PAGE = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="/sdk.js"></script>
</head>
<body>
  <script>
    window.show = () => {
      const sdk = window['@iterable/web-sdk'];
      const { triggerDisplayMessages } = sdk.getInAppMessages(
        {
          count: 1,
          packageName: 'webkit-regression',
          closeButton: {
            position: 'top-right',
            color: '#000',
            size: '24px',
            isRequiredToDismissMessage: true
          }
        },
        { display: 'deferred' }
      );
      return triggerDisplayMessages([
        {
          messageId: 'm1',
          campaignId: 1,
          createdAt: Date.now(),
          expiresAt: Date.now() + 1e9,
          priorityLevel: 300.5,
          read: false,
          saveToInbox: false,
          trigger: { type: 'immediate' },
          content: {
            html: '<div style="padding:24px;background:#fff">Hello</div>',
            inAppDisplaySettings: {
              bgColor: { hex: '#000000', alpha: 0.5 },
              shouldAnimate: false
            },
            webInAppDisplaySettings: { position: 'Center' }
          }
        }
      ]);
    };
  </script>
</body>
</html>`;

let server: http.Server;
let baseURL: string;

test.beforeAll(async () => {
  const sdkPath = path.join(__dirname, '..', 'index.js');
  if (!fs.existsSync(sdkPath)) {
    throw new Error('Missing index.js. Run yarn webpack before this test.');
  }
  const sdk = fs.readFileSync(sdkPath);
  server = http.createServer((req, res) => {
    if (req.url?.startsWith('/sdk.js')) {
      res.setHeader('content-type', 'application/javascript');
      res.end(sdk);
      return;
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(PAGE);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Test server failed to bind');
  }
  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

const openMessage = async (page: Page) => {
  await page.route('**/*', (route) => {
    const { hostname } = new URL(route.request().url());
    if (hostname === '127.0.0.1' || hostname === 'localhost') {
      route.continue();
      return;
    }
    route.abort();
  });
  await page.goto(baseURL);
  await page.evaluate(() =>
    (window as unknown as { show: () => Promise<void> }).show()
  );
};

test('Chrome on iOS paints the SDK close button on the parent page', async ({
  page
}) => {
  await openMessage(page);

  const parentButton = page.locator('#close-x-button');
  const frameButton = page
    .frameLocator('#iterable-iframe')
    .locator('#close-x-button');

  await expect(parentButton).toHaveCount(1);
  await expect(frameButton).toHaveCount(0);

  await parentButton.click();
  await expect(page.locator('#iterable-iframe')).toHaveCount(0);
});

test('Chromium keeps the SDK close button inside the iframe', async ({
  page
}) => {
  await openMessage(page);

  const parentButton = page.locator('#close-x-button');
  const frameButton = page
    .frameLocator('#iterable-iframe')
    .locator('#close-x-button');

  await expect(parentButton).toHaveCount(0);
  await expect(frameButton).toHaveCount(1);

  await frameButton.click();
  await expect(page.locator('#iterable-iframe')).toHaveCount(0);
});
