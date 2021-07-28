/**
 * @jest-environment jsdom
 */
import { srSpeak } from './srSpeak';

describe('srSpeak', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.advanceTimersByTime(2000);
    document.body.innerHTML = '';
  });

  it('should paint a div to the DOM', () => {
    srSpeak('hello!', 'assertive');
    jest.advanceTimersByTime(200);

    const element: Element =
      document.querySelector('[data-test-id="sr-speak"]') || ({} as Element);
    const styles = getComputedStyle(element);

    expect(element.tagName).toBe('DIV');
    expect(styles.position).toBe('absolute');
    expect(styles.overflow).toBe('hidden');
    expect(styles.width).toBe('1px');
    expect(styles.height).toBe('1px');
    expect(styles.clip).toBe('rect(1px, 1px, 1px, 1px)');
    expect(element.getAttribute('aria-live')).toBe('assertive');
  });

  it('should default to polite aria-live', () => {
    srSpeak('hello!');
    jest.advanceTimersByTime(200);

    const element: Element =
      document.querySelector('[data-test-id="sr-speak"]') || ({} as Element);
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  it('should remove element after 1000MS', () => {
    srSpeak('hello!', 'assertive');
    jest.advanceTimersByTime(2000);

    const element = document.querySelector('[data-test-id="sr-speak"]');

    expect(element).toBe(null);
  });

  it("should not remove the element if it can't find it", () => {
    Object.defineProperty(document, 'getElementById', {
      value: jest.fn().mockReturnValue(null)
    });

    srSpeak('hello!', 'assertive');
    jest.advanceTimersByTime(2000);

    const element = document.querySelector('[data-test-id="sr-speak"]');

    expect(element).not.toBe(null);
  });
});
