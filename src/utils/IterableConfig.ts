import { IterableCustomActionHandler, IterableUrlHandler } from '..';

class IterableConfig {
  public static urlHandler: IterableUrlHandler | null = null;
  public static customActionHandler: IterableCustomActionHandler | null = null;
}

export default IterableConfig;
