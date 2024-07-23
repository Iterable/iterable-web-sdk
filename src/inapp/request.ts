import { GETMESSAGES_PATH, SDK_VERSION, WEB_PLATFORM } from '../constants';
import { baseIterableRequest } from '../request';
import schema from './inapp.schema';
import { InAppMessageResponse, InAppMessagesRequestParams } from './types';

type RequestInAppMessagesProps = {
  latestCachedMessageId?: string;
  payload: InAppMessagesRequestParams;
};

export const requestInAppMessages = ({
  latestCachedMessageId,
  payload
}: RequestInAppMessagesProps) =>
  baseIterableRequest<InAppMessageResponse>({
    method: 'GET',
    /** @note TBD: Parameter will be enabled once new endpoint is ready */
    // url: options?.useLocalCache ? CACHE_ENABLED_GETMESSAGES_PATH : GETMESSAGES_PATH,
    url: GETMESSAGES_PATH,
    validation: { params: schema },
    params: {
      ...payload,
      platform: WEB_PLATFORM,
      SDKVersion: SDK_VERSION,
      latestCachedMessageId
    }
  });

type RequestMessagesProps = {
  payload: InAppMessagesRequestParams;
};

export const requestMessages = async ({ payload }: RequestMessagesProps) =>
  /** @note TBD: Caching implementation and associated parameter
   * will be enabled once new endpoint is ready */
  // if (!options?.useLocalCache) return await requestInAppMessages({});
  /** @note Always early return until then */
  requestInAppMessages({ payload });
