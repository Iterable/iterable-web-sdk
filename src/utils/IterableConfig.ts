import { IterableCustomActionHandler, IterableUrlHandler } from '..';

export class IterableConfig {
  public urlHandler: IterableUrlHandler;
  public customActionHandler: IterableCustomActionHandler;

  constructor(urlHandler: IterableUrlHandler, customActionHandler: IterableCustomActionHandler) {
    this.urlHandler = urlHandler;
    this.customActionHandler = customActionHandler;
  }
}
