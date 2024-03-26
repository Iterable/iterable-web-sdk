import { IterableConfig } from 'src/utils/IterableConfig';
import {
  IterableAction,
  IterableActionContext,
  IterableActionSource
} from '../embedded/types';

class IterableActionRunnerImpl {
  iterableConfig: IterableConfig;

  constructor(config: IterableConfig) {
    this.iterableConfig = config;
  }

  executeAction(
    action: IterableAction | null,
    source: IterableActionSource,
  ): boolean {
    if (action === null) {
      return false;
    }

    const actionContext: IterableActionContext = { action, source };
    if (action.type === 'openUrl') {
      return this.openUri(action.data, actionContext);
    } else {
      return this.callCustomActionIfSpecified(
        action,
        actionContext
      );
    }
  }

  private openUri(
    uri: string,
    actionContext: IterableActionContext
  ): boolean {
    if (this.iterableConfig.urlHandler) {
      if (this.iterableConfig.urlHandler.handleIterableURL(uri, actionContext)) {
        return true;
      }
    }

    window.open(uri, '_blank');

    return true;
  }

  private callCustomActionIfSpecified(
    action: IterableAction,
    actionContext: IterableActionContext
  ): boolean {
    if (action.type && action.type !== '') {
      if (this.iterableConfig.customActionHandler) {
        return this.iterableConfig.customActionHandler.handleIterableCustomAction(
          action,
          actionContext
        );
      }
    }
    return false;
  }
}

export class IterableActionRunner extends IterableActionRunnerImpl {}
