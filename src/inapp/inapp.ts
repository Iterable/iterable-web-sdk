import {
  InAppMessage,
  InAppMessagesRequestParams,
  InAppMessageResponse
} from './types';
import { IterablePromise } from '../types';
import { baseIterableRequest } from '../request';
import {
  addButtonAttrsToAnchorTag,
  filterHiddenInAppMessages,
  paintIFrame,
  sortInAppMessages
} from './utils';

export function getInAppMessages(
  payload: InAppMessagesRequestParams
): IterablePromise<InAppMessageResponse>;
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  showInAppMessagesAutomatically: true
): {
  pauseMessageStream: () => void;
  resumeMessageStream: () => void;
  request: () => IterablePromise<InAppMessageResponse>;
};
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  showInAppMessagesAutomatically?: boolean
) {
  if (showInAppMessagesAutomatically) {
    let timer: NodeJS.Timeout | null = null;
    let messageIndex = 0;
    let parsedMessages: InAppMessage[] = [];

    const paintMessageToDOM = () => {
      if (parsedMessages?.[messageIndex]) {
        /* add the message's html to an iframe and paint it to the DOM */
        const iframe = paintIFrame(
          parsedMessages[messageIndex].content.html,
          'in-app iframe message opened'
        );

        /* find the close button */
        const dismissNodes = [
          /** @todo "ibtl://" deprecated? */
          ...(iframe.contentWindow?.document?.querySelectorAll(
            'a[href="itbl://dismiss"]'
          ) || []),
          ...(iframe.contentWindow?.document?.querySelectorAll(
            'a[href="iterable://dismiss"]'
          ) || [])
        ];

        dismissNodes?.forEach((eachNode) => {
          /* 
          give the close anchor tag properties that make it 
          behave more like a button with a logical aria label
          */
          addButtonAttrsToAnchorTag(eachNode, 'close modal');

          /*
         finally add a click handler that makes the appropriate tracking API
         calls so that it doesn't show up again.
         */
          eachNode.addEventListener('click', () => {
            iframe.remove();
            messageIndex += 1;
            timer = setTimeout(() => {
              clearTimeout(timer as NodeJS.Timeout);

              paintMessageToDOM();
            }, payload.displayInterval || 30000);
          });
        });
        iframe.contentWindow?.document?.close();
      }
    };

    return {
      request: (): IterablePromise<InAppMessageResponse> =>
        baseIterableRequest<InAppMessageResponse>({
          method: 'GET',
          url: '/inApp/getMessages',
          params: payload
        }).then((response) => {
          /* 
            if the user passed the flag to automatically paint the in-app messages
            to the DOM, start a timer and show each in-app message upon close + timer countdown
            
            However there are 3 conditions in which to not show a message:
            
            1. _read_ key is truthy
            2. _trigger.type_ key is "never"
            3. HTML body is blank

            so first filter out unwanted messages and sort them
          */
          parsedMessages = sortInAppMessages(
            filterHiddenInAppMessages(response.data.inAppMessages)
          ) as InAppMessage[];

          paintMessageToDOM();
          return {
            ...response,
            data: {
              inAppMessages: parsedMessages
            }
          };
        }),
      pauseMessageStream: () => {
        if (timer) {
          clearTimeout(timer);
        }
      },
      resumeMessageStream: () => {
        paintMessageToDOM();
      }
    };
  }

  return baseIterableRequest<InAppMessageResponse>({
    method: 'GET',
    url: '/inApp/getMessages',
    params: payload
  });
}
