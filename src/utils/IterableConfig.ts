import { IterableCustomActionHandler, IterableUrlHandler } from '..';

export class IterableConfig {
  public static urlHandler: IterableUrlHandler | null = null;

  public static customActionHandler: IterableCustomActionHandler | null = null;

  /**
   * Controls whether URLs are opened in a new tab/window or the same tab.
   * When true (default), URLs open in a new tab via window.open(url, '_blank').
   * When false, URLs open in the same tab via window.location.assign(url).
   */
  public static openLinksInNewTab = true;
}
