import { IterableConfig } from 'src/utils/IterableConfig';
import {
  IterableAction,
  IterableActionContext,
  IterableActionSource
} from '../embedded/types';
import { URL_SCHEME_OPEN } from 'src/constants';

class IterableActionRunnerImpl {
  static executeAction(
    context: any,
    action: IterableAction | null,
    source: IterableActionSource
  ): boolean {
    if (action === null) {
      return false;
    }

    const actionContext: IterableActionContext = { action, source };
    if (action.type === URL_SCHEME_OPEN) {
      return IterableActionRunnerImpl.openUri(action.data, actionContext);
    } else {
      return IterableActionRunnerImpl.callCustomActionIfSpecified(
        action,
        actionContext
      );
    }
  }

  private static openUri(
    uri: string,
    actionContext: IterableActionContext
  ): boolean {
    if (IterableConfig.urlHandler) {
      if (IterableConfig.urlHandler.handleIterableURL(uri, actionContext)) {
        return true;
      }
    }

    window.open(uri, '_blank');

    return true;
  }

  private static callCustomActionIfSpecified(
    action: IterableAction,
    actionContext: IterableActionContext
  ): boolean {
    if (action.type && action.type !== '') {
      if (IterableConfig.customActionHandler) {
        return IterableConfig.customActionHandler.handleIterableCustomAction(
          action,
          actionContext
        );
      }
    }
    return false;
  }
}

export class IterableActionRunner extends IterableActionRunnerImpl {}
