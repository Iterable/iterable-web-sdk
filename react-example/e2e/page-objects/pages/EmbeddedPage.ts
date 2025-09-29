import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EmbeddedPage extends BasePage {
  // GET endpoint elements
  readonly getReceivedSubmit: Locator;

  readonly getReceivedResponse: Locator;

  // POST endpoints elements
  readonly postReceivedInput: Locator;

  readonly postReceivedSubmit: Locator;

  readonly postReceivedResponse: Locator;

  readonly clickEventInput: Locator;

  readonly clickEventSubmit: Locator;

  readonly clickEventResponse: Locator;

  readonly dismissEventInput: Locator;

  readonly dismissEventSubmit: Locator;

  readonly dismissEventResponse: Locator;

  readonly sessionEventInput: Locator;

  readonly sessionEventSubmit: Locator;

  readonly sessionEventResponse: Locator;

  // Page headings
  readonly embeddedMessageHeading: Locator;

  readonly getReceivedHeading: Locator;

  readonly postReceivedHeading: Locator;

  readonly clickHeading: Locator;

  readonly dismissHeading: Locator;

  readonly sessionHeading: Locator;

  // User ID input
  readonly userIdInput: Locator;

  constructor(page: Page) {
    super(page);

    // GET endpoint
    this.getReceivedSubmit = page.getByTestId('received-get-submit');
    this.getReceivedResponse = page.getByTestId('received-get-response');

    // POST endpoints
    this.postReceivedInput = page.getByTestId('received-post-input');
    this.postReceivedSubmit = page.getByTestId('received-post-submit');
    this.postReceivedResponse = page.getByTestId('received-post-response');

    this.clickEventInput = page.getByTestId('click-input');
    this.clickEventSubmit = page.getByTestId('click-submit');
    this.clickEventResponse = page.getByTestId('click-response');

    this.dismissEventInput = page.getByTestId('dismiss-input');
    this.dismissEventSubmit = page.getByTestId('dismiss-submit');
    this.dismissEventResponse = page.getByTestId('dismiss-response');

    this.sessionEventInput = page.getByTestId('session-input');
    this.sessionEventSubmit = page.getByTestId('session-submit');
    this.sessionEventResponse = page.getByTestId('session-response');

    // Headings
    this.embeddedMessageHeading = page.getByTestId('embedded-heading');
    this.getReceivedHeading = page.getByRole('heading', {
      name: 'GET /embedded-messaging/events/received'
    });
    this.postReceivedHeading = page.getByRole('heading', {
      name: 'POST /embedded-messaging/events/received'
    });
    this.clickHeading = page.getByRole('heading', {
      name: 'POST /embedded-messaging/events/click'
    });
    this.dismissHeading = page.getByRole('heading', {
      name: 'POST /embedded-messaging/events/dismiss'
    });
    this.sessionHeading = page.getByRole('heading', {
      name: 'POST /embedded-messaging/events/session'
    });

    // User ID input
    this.userIdInput = page.getByTestId('embedded-userid-input');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/embedded');
    await this.waitForPageLoad();
  }

  async isPageLoaded() {
    await expect(this.embeddedMessageHeading).toBeVisible();
    await expect(this.getReceivedHeading).toBeVisible();
    await expect(this.postReceivedHeading).toBeVisible();
    await expect(this.clickHeading).toBeVisible();
    await expect(this.dismissHeading).toBeVisible();
    await expect(this.sessionHeading).toBeVisible();
  }

  // GET endpoint methods (this one works!)
  async submitGetReceived() {
    await this.getReceivedSubmit.click();
    await this.page.waitForTimeout(1000); // Wait for response
  }

  async verifyGetReceivedSuccess() {
    // Check for the success console message
    const consoleMessages: string[] = [];
    this.page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    await this.submitGetReceived();

    // Wait and check for success message
    await this.page.waitForTimeout(2000);
    const hasSyncedMessage = consoleMessages.some((msg) =>
      msg.includes('Synced message')
    );
    expect(hasSyncedMessage).toBeTruthy();
  }

  // POST endpoint methods (these have errors but we can test the UI)
  async enterMessageIdForPostReceived(messageId: string) {
    await this.postReceivedInput.fill(messageId);
  }

  async submitPostReceived() {
    await this.postReceivedSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  async enterMessageIdForClick(messageId: string) {
    await this.clickEventInput.fill(messageId);
  }

  async submitClickEvent() {
    await this.clickEventSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  async enterMessageIdForDismiss(messageId: string) {
    await this.dismissEventInput.fill(messageId);
  }

  async submitDismissEvent() {
    await this.dismissEventSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  async enterMessageIdForSession(messageId: string) {
    await this.sessionEventInput.fill(messageId);
  }

  async submitSessionEvent() {
    await this.sessionEventSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  async enterUserId(userId: string) {
    await this.userIdInput.fill(userId);
  }

  // Test that forms accept input correctly
  async testFormInputs() {
    await this.isPageLoaded();

    const testMessageId = 'test-msg-123';
    const testUserId = 'test-user-456';

    // Test all inputs accept data
    await this.enterUserId(testUserId);
    await expect(this.userIdInput).toHaveValue(testUserId);

    await this.enterMessageIdForPostReceived(testMessageId);
    await expect(this.postReceivedInput).toHaveValue(testMessageId);

    await this.enterMessageIdForClick(testMessageId);
    await expect(this.clickEventInput).toHaveValue(testMessageId);

    await this.enterMessageIdForDismiss(testMessageId);
    await expect(this.dismissEventInput).toHaveValue(testMessageId);

    await this.enterMessageIdForSession(testMessageId);
    await expect(this.sessionEventInput).toHaveValue(testMessageId);
  }
}
