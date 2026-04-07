import { IterableCustomActionHandler, IterableUrlHandler } from '..';

export class IterableConfig {
  public static urlHandler: IterableUrlHandler | null = null;

  public static customActionHandler: IterableCustomActionHandler | null = null;

  /**
   * Controls whether URLs opened by the SDK (e.g. from embedded message
   * buttons) are opened in a new tab (`_blank`) or in the same tab (`_self`).
   *
   * Defaults to `true` (new tab / `_blank`) for backward compatibility.
   */
  public static openLinksInNewTab = true;
}
