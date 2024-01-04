export enum IterableActionSource {
  PUSH = 'PUSH',
  APP_LINK = 'APP_LINK',
  IN_APP = 'IN_APP',
  EMBEDDED = 'EMBEDDED'
}

export interface IterableAction {
  type: string;
  data: string;
}

export interface IterableActionContext {
  action: IterableAction;
  source: IterableActionSource;
}

interface IterableConfig {
  urlHandler?: {
    handleIterableURL(
      uri: string,
      actionContext: IterableActionContext
    ): boolean;
  };
  customActionHandler?: {
    handleIterableCustomAction(
      action: IterableAction,
      actionContext: IterableActionContext
    ): boolean;
  };
}

class IterableActionRunnerConfig {
  static config: IterableConfig = {};
}

class IterableActionRunnerImpl {
  executeAction(
    context: any,
    action: IterableAction | null,
    source: IterableActionSource
  ): boolean {
    if (action === null) {
      return false;
    }

    const actionContext: IterableActionContext = { action, source };

    if (action.type === 'openUrl') {
      return this.openUri(action.data, actionContext);
    } else {
      return this.callCustomActionIfSpecified(action, actionContext);
    }
  }

  private openUri(uri: string, actionContext: IterableActionContext): boolean {
    if (IterableActionRunnerConfig.config.urlHandler) {
      if (
        IterableActionRunnerConfig.config.urlHandler.handleIterableURL(
          uri,
          actionContext
        )
      ) {
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
      if (IterableActionRunnerConfig.config.customActionHandler) {
        return IterableActionRunnerConfig.config.customActionHandler.handleIterableCustomAction(
          action,
          actionContext
        );
      }
    }
    return false;
  }
}

IterableActionRunnerConfig.config = {
  urlHandler: {
    handleIterableURL(
      uri: string,
      actionContext: IterableActionContext
    ): boolean {
      global.open(uri, '_blank', 'noopener,noreferrer');
      return true;
    }
  },
  customActionHandler: {
    handleIterableCustomAction(
      action: IterableAction,
      actionContext: IterableActionContext
    ): boolean {
      let uri = '';
      if (action.type.startsWith('action://')) {
        uri = action.type.replace('action://', '');
      } else if (action.type.startsWith('iterable://')) {
        uri = action.type.replace('iterable://', '');
      }

      global.open(uri, '_blank', 'noopener,noreferrer');
      return true;
    }
  }
};

export class IterableActionRunner extends IterableActionRunnerImpl {
  static config = IterableActionRunnerConfig.config;
}
