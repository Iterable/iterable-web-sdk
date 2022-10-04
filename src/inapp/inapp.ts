import { delMany, entries } from 'idb-keyval';
import _set from 'lodash/set';
import {
  ANIMATION_DURATION,
  ANIMATION_STYLESHEET,
  DISPLAY_INTERVAL_DEFAULT,
  ENABLE_INAPP_CONSUME,
  GETMESSAGES_PATH,
  IS_PRODUCTION,
  SDK_VERSION,
  WEB_PLATFORM
} from 'src/constants';
import { throttle } from 'throttle-debounce';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppOpen
} from '../events';
import { baseIterableRequest } from '../request';
import { IterablePromise } from '../types';
import schema from './inapp.schema';
import {
  InAppMessage,
  InAppMessageResponse,
  InAppMessagesRequestParams
} from './types';
import {
  addButtonAttrsToAnchorTag,
  addNewMessagesToCache,
  addStyleSheet,
  determineRemainingStorageQuota,
  filterHiddenInAppMessages,
  generateCloseButton,
  getHostnameFromUrl,
  paintIFrame,
  paintOverlay,
  sortInAppMessages,
  trackMessagesDelivered,
  wrapWithIFrame
} from './utils';

let parsedMessages: InAppMessage[] = [];
let timer: NodeJS.Timeout | null = null;
let messageIndex = 0;
let isPaused = false;

export const clearMessages = () => {
  parsedMessages = [];
  messageIndex = 0;
  isPaused = false;
  if (timer) {
    clearTimeout(timer);
  }
};

export function getInAppMessages(
  payload: InAppMessagesRequestParams
): IterablePromise<InAppMessageResponse>;
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  showInAppMessagesAutomatically: true
): {
  pauseMessageStream: () => void;
  resumeMessageStream: () => Promise<HTMLIFrameElement | ''>;
  request: () => IterablePromise<InAppMessageResponse>;
};
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  showInAppMessagesAutomatically: { display: 'immediate' | 'deferred' }
): {
  pauseMessageStream: () => void;
  resumeMessageStream: () => Promise<HTMLIFrameElement | ''>;
  request: () => IterablePromise<InAppMessageResponse>;
  triggerDisplayMessages: (
    messages: Partial<InAppMessage>[]
  ) => Promise<HTMLIFrameElement | ''>;
};
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  showInAppMessagesAutomatically?:
    | boolean
    | { display: 'immediate' | 'deferred' }
) {
  clearMessages();
  const dupedPayload = { ...payload };

  /* delete SDK-defined payload props and email and userId */
  delete (dupedPayload as any).userId;
  delete (dupedPayload as any).email;
  delete dupedPayload.displayInterval;
  delete dupedPayload.onOpenScreenReaderMessage;
  delete dupedPayload.onOpenNodeToTakeFocus;
  delete dupedPayload.topOffset;
  delete dupedPayload.bottomOffset;
  delete dupedPayload.rightOffset;
  delete dupedPayload.animationDuration;
  delete dupedPayload.handleLinks;
  delete dupedPayload.closeButton;

  const requestInAppMessages = ({
    latestCachedMessageId
  }: {
    latestCachedMessageId?: string;
  }) =>
    baseIterableRequest<InAppMessageResponse>({
      method: 'GET',
      url: GETMESSAGES_PATH,
      validation: { params: schema },
      params: {
        ...dupedPayload,
        platform: WEB_PLATFORM,
        SDKVersion: SDK_VERSION,
        latestCachedMessageId
      }
    });

  const requestMessages = async () => {
    try {
      const cachedMessages: [string, InAppMessage][] = await entries();

      /** determine most recent message & delete expired messages */
      let latestCachedMessageId: string | undefined;
      let latestCreatedAtTimestamp: EpochTimeStamp = 0;
      const expiredMessagesInCache: string[] = [];
      const now = Date.now();

      cachedMessages.forEach(([cachedMessageId, cachedMessage]) => {
        if (cachedMessage.expiresAt < now) {
          expiredMessagesInCache.push(cachedMessageId);
        } else if (cachedMessage.createdAt > latestCreatedAtTimestamp) {
          latestCachedMessageId = cachedMessageId;
          latestCreatedAtTimestamp = cachedMessage.createdAt;
        }
      });
      await delMany(expiredMessagesInCache);

      /**
       * call getMessages with latestCachedMessageId to get the message delta
       * (uncached messages have full detail, rest just have messageId)
       */
      const response = await requestInAppMessages({ latestCachedMessageId });
      const { inAppMessages } = response.data;

      /** combine cached messages with NEW messages in delta response */
      const allMessages: Partial<InAppMessage>[] = [];
      const newMessages: { messageId: string; message: InAppMessage }[] = [];
      inAppMessages?.forEach((inAppMessage) => {
        /**
         * if message in response has no content property, then that means it is
         * older than the latest cached message and should be retrieved from the
         * cache using the messageId
         *
         * expecting messages with no content to look like the last 2 messages...
         * {
         *   inAppMessages: [
         *     { ...messageWithContentHasFullDetails01 },
         *     { ...messageWithContentHasFullDetails02 },
         *     { messageId: 'messageWithoutContentHasNoOtherProperties01' },
         *     { messageId: 'messageWithoutContentHasNoOtherProperties02' }
         *   ]
         * }
         */
        if (!inAppMessage.content) {
          const cachedMessage = cachedMessages.find(
            ([messageId]) => inAppMessage.messageId === messageId
          );
          if (cachedMessage) allMessages.push(cachedMessage[1]);
        } else {
          allMessages.push(inAppMessage);
          if (inAppMessage.messageId)
            newMessages.push({
              messageId: inAppMessage.messageId,
              message: inAppMessage as InAppMessage
            });
        }
      });

      /** add new messages to the cache if they fit in the cache */
      await addNewMessagesToCache(newMessages);

      /** return combined response */
      return {
        ...response,
        data: {
          inAppMessages: allMessages
        }
      };
    } catch (err: any) {
      console.warn(
        'Error requesting in-app messages',
        err?.response?.data?.clientErrors ?? err
      );
    }
    return await requestInAppMessages({});
  };

  if (showInAppMessagesAutomatically) {
    addStyleSheet(document, ANIMATION_STYLESHEET(payload.animationDuration));
    const paintMessageToDOM = (): Promise<HTMLIFrameElement | ''> => {
      if (parsedMessages?.[messageIndex]) {
        const activeMessage = parsedMessages[messageIndex];
        const shouldAnimate =
          activeMessage?.content?.inAppDisplaySettings?.shouldAnimate;
        const position =
          activeMessage?.content?.webInAppDisplaySettings?.position || 'Center';

        const dismissMessage = (
          activeIframe: HTMLIFrameElement,
          url?: string
        ) => {
          if (activeMessage?.content?.inAppDisplaySettings?.shouldAnimate) {
            activeIframe.className =
              position === 'Center' || position === 'Full'
                ? 'fade-out'
                : 'slide-out';
          }

          const trackPayload = {
            messageId: activeMessage.messageId,
            deviceInfo: { appPackageName: dupedPayload.packageName }
          };
          /* close the message and start a timer to show the next one */
          trackInAppClose(
            url
              ? {
                  ...trackPayload,
                  clickedUrl: url
                }
              : trackPayload
          ).catch((e) => e);

          if (shouldAnimate) {
            const animationTimer = global.setTimeout(() => {
              activeIframe.remove();
              clearTimeout(animationTimer);
            }, ANIMATION_DURATION);
          } else {
            activeIframe.remove();
          }

          const timeToNextMessage = shouldAnimate
            ? (payload.displayInterval || DISPLAY_INTERVAL_DEFAULT) +
              ANIMATION_DURATION
            : payload.displayInterval || DISPLAY_INTERVAL_DEFAULT;

          messageIndex += 1;
          timer = global.setTimeout(() => {
            clearTimeout(timer as NodeJS.Timeout);

            paintMessageToDOM();
          }, timeToNextMessage);
        };

        const overlay = paintOverlay(
          activeMessage?.content?.inAppDisplaySettings?.bgColor?.hex,
          activeMessage?.content?.inAppDisplaySettings?.bgColor?.alpha,
          shouldAnimate
        );

        /* add the message's html to an iframe and paint it to the DOM */
        return paintIFrame(
          activeMessage.content.html as string,
          position,
          shouldAnimate,
          payload.onOpenScreenReaderMessage || 'in-app iframe message opened',
          payload.topOffset,
          payload.bottomOffset,
          payload.rightOffset
        ).then((activeIframe) => {
          const throttledResize =
            position !== 'Full'
              ? throttle(750, () => {
                  activeIframe.style.height =
                    (activeIframe.contentWindow?.document?.body?.scrollHeight ||
                      0) + 'px';
                })
              : () => null;
          global.addEventListener('resize', throttledResize);

          try {
            const elementToFocus =
              activeIframe.contentWindow?.document.body?.querySelector(
                payload.onOpenNodeToTakeFocus || ''
              );

            /* try to focus on the query selector the customer provided  */
            (elementToFocus as HTMLElement).focus();
          } catch (e) {
            /* otherwise, find the first focusable element and focus on that */
            const firstFocusableElement =
              activeIframe.contentWindow?.document.body?.querySelector(
                'button, a:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );

            if (firstFocusableElement) {
              (firstFocusableElement as HTMLElement).focus();
            }
          }

          const handleEscKeypress = (
            event: KeyboardEvent,
            documentEventHandler: (event: KeyboardEvent) => void,
            iframeEventHandler?: (event: KeyboardEvent) => void
          ) => {
            if (event.key === 'Escape') {
              dismissMessage(activeIframe);
              overlay.remove();
              document.removeEventListener('keydown', documentEventHandler);
              if (
                activeIframe?.contentWindow?.document &&
                !!iframeEventHandler
              ) {
                activeIframe.contentWindow?.document.removeEventListener(
                  'keydown',
                  iframeEventHandler
                );
              }
              global.removeEventListener('resize', throttledResize);
            }
          };

          /*
            handleDocumentEscPress and handleIFrameEscPress both are separate
            keydown handlers to dismiss the message when the _esc_ key is pressed.

            The reason these are abstracted into their own methods is because the method
            for adding the event handler also removes itself in its own callback. BUT since
            we have 2 event listeners (one for the document, and one for the iframe), the method
            to add the listener needs to know about both of these _addEventListener_ abstracted
            callbacks so the code can properly remove the same listener that was added.

            In other words, it solves for the issue where you're adding an event listener as a lambda
            like so and and you get a unique event listener each time:

            document.addEventListener('keydown', () => // do stuff)

            this example code adds a new event listener each time and never gets cleaned up 
            because there's no reference that to "() => // do stuff" that can be re-used in the
            _removeEventListener_ call.
          */
          const handleDocumentEscPress = (event: KeyboardEvent) =>
            handleEscKeypress(event, handleDocumentEscPress);

          const handleIFrameEscPress = (event: KeyboardEvent) =>
            handleEscKeypress(
              event,
              handleDocumentEscPress,
              handleIFrameEscPress
            );

          document.addEventListener('keydown', handleDocumentEscPress);

          if (activeIframe?.contentWindow?.document) {
            activeIframe.contentWindow?.document.addEventListener(
              'keydown',
              handleIFrameEscPress
            );
          }

          if (!payload.closeButton?.isRequiredToDismissMessage) {
            overlay.addEventListener('click', () => {
              dismissMessage(activeIframe);
              overlay.remove();
              document.removeEventListener('keydown', handleDocumentEscPress);
              if (activeIframe?.contentWindow?.document) {
                activeIframe.contentWindow?.document.removeEventListener(
                  'keydown',
                  handleIFrameEscPress
                );
              }
              global.removeEventListener('resize', throttledResize);
            });
          }

          /*
            create an absolutely positioned button that lies underneath the
            in-app message and takes up full width and height

            The reason for this is if the customer made their in-app take less width
            than the iframe surrounding it, they should still be able to click outside
            their in-app, but within the bounds of the iframe to dismiss it.

            The overlay doesn't handle this because the overlay only surrounds the iframe,
            not the in-app message. So imagine an in-app looking like this:
          */
          if (activeIframe.contentWindow?.document) {
            const absoluteDismissButton =
              activeIframe.contentWindow.document.createElement('button');
            absoluteDismissButton.style.cssText = `
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                font: inherit;
                cursor: unset;
                outline: inherit;
                height: 100vh;
                width: 100vw;
                position: fixed;
                top: 0;
                left: 0;
                z-index: -1;
              `;
            /* 
              don't let the user tab to this button. 
              It's not necessarily for blind folks to tab over 
            */
            absoluteDismissButton.tabIndex = -1;
            const triggerClose = () => {
              dismissMessage(activeIframe);
              overlay.remove();
              document.removeEventListener('keydown', handleDocumentEscPress);
              if (activeIframe?.contentWindow?.document) {
                activeIframe.contentWindow?.document.removeEventListener(
                  'keydown',
                  handleIFrameEscPress
                );
              }
              global.removeEventListener('resize', throttledResize);
            };
            absoluteDismissButton.addEventListener('click', triggerClose);
            activeIframe.contentWindow.document.body.appendChild(
              absoluteDismissButton
            );

            /*
              here we paint an optional close button if the user provided configuration
              values. This button is just a quality-of-life feature so that the customer will
              have an easy way to close the modal outside of the other methods.
            */
            if (payload.closeButton) {
              const newButton = generateCloseButton(
                document,
                payload.closeButton?.position,
                payload.closeButton?.color,
                payload.closeButton?.size,
                payload.closeButton?.iconPath,
                payload.closeButton.topOffset,
                payload.closeButton.sideOffset
              );
              newButton.addEventListener('click', triggerClose);
              activeIframe.contentWindow.document.body.appendChild(newButton);
            }
          }

          /* 
            track in-app consumes only when _saveToInbox_ 
            is falsy or undefined and always track in-app opens

            Also swallow any 400+ response errors. We don't care about them.
          */
          if (ENABLE_INAPP_CONSUME || IS_PRODUCTION) {
            const trackPayload = {
              messageId: activeMessage.messageId,
              deviceInfo: {
                appPackageName: payload.packageName
              }
            };
            const trackRequests = [
              trackInAppOpen(trackPayload),
              ...(!activeMessage.saveToInbox
                ? [trackInAppConsume(trackPayload)]
                : [])
            ];
            Promise.all(trackRequests).catch((e) => e);
          }

          /* now we'll add click tracking to _all_ anchor tags */
          const links =
            activeIframe.contentWindow?.document?.querySelectorAll('a') || [];

          for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const clickedUrl = link.getAttribute('href') || '';
            const openInNewTab = link.getAttribute('target') === '_blank';
            const isIterableKeywordLink = !!clickedUrl.match(
              /iterable:\/\/|action:\/\//gim
            );
            const isDismissNode = !!clickedUrl.match(/iterable:\/\/dismiss/gim);
            const isActionLink = !!clickedUrl.match(/action:\/\//gim);

            if (isDismissNode || isActionLink) {
              /* 
                give the close anchor tag properties that make it 
                behave more like a button with a logical aria label
              */
              addButtonAttrsToAnchorTag(link, 'close modal');
            }

            link.addEventListener('click', (event) => {
              /* 
                remove default linking behavior because we're in an iframe 
                so we need to link the user programatically
              */
              event.preventDefault();

              if (clickedUrl) {
                /* track the clicked link */
                const clickedHostname = getHostnameFromUrl(clickedUrl);
                /* !clickedHostname means the link was relative with no hostname */
                const isInternalLink =
                  clickedHostname === global.location.host || !clickedHostname;
                const isOpeningLinkInSameTab =
                  (!payload.handleLinks && !openInNewTab) ||
                  payload.handleLinks === 'open-all-same-tab' ||
                  (isInternalLink &&
                    payload.handleLinks === 'external-new-tab');
                trackInAppClick(
                  {
                    clickedUrl,
                    messageId: activeMessage?.messageId,
                    deviceInfo: {
                      appPackageName: dupedPayload.packageName
                    }
                  },
                  /* 
                    only call with the fetch API if we're linking in the 
                    same tab and it's not a reserved keyword link.
                  */
                  isOpeningLinkInSameTab && !isIterableKeywordLink
                  /* swallow the network error */
                ).catch((e) => e);

                if (isDismissNode || isActionLink) {
                  dismissMessage(activeIframe, clickedUrl);
                  overlay.remove();
                  document.removeEventListener(
                    'keydown',
                    handleDocumentEscPress
                  );
                  if (activeIframe?.contentWindow?.document) {
                    activeIframe.contentWindow?.document.removeEventListener(
                      'keydown',
                      handleIFrameEscPress
                    );
                  }
                  global.removeEventListener('resize', throttledResize);
                }

                if (isActionLink) {
                  const filteredMatch = (new RegExp(
                    /^.*action:\/\/(.*)$/,
                    'gmi'
                  )?.exec(clickedUrl) || [])?.[1];
                  /* 
                    just post the message to the window when clicking 
                    action:// links and early return
                  */
                  return global.postMessage(
                    { type: 'iterable-action-link', data: filteredMatch },
                    '*'
                  );
                }

                /*
                  finally (since we're in an iframe), programatically click the link
                  and send the user to where they need to go, only if it's not one
                  of the reserved iterable keyword links
                */
                if (!isIterableKeywordLink) {
                  const { handleLinks } = payload;
                  if (typeof handleLinks === 'string') {
                    /* 
                      if the _handleLinks_ option is set, we need to open links 
                      according to that enum. So the way this works is:

                      1. If _open-all-same-tab, then open every link in the same tab
                      2. If _open-all-new-tab, open all in new tab
                      3. If _external-new-tab_, open internal links in same tab, otherwise new tab.

                      This was a fix to account for the fact that Bee editor templates force
                      target="_blank" on all links, so we gave this option as an escape hatch for that.
                    */
                    if (
                      handleLinks === 'open-all-same-tab' ||
                      (isInternalLink && handleLinks === 'external-new-tab')
                    ) {
                      global.location.assign(clickedUrl);
                    } else {
                      global.open(clickedUrl, '_blank', 'noopener,noreferrer');
                    }
                  } else if (openInNewTab) {
                    /**
                      Using target="_blank" without rel="noreferrer" and rel="noopener"
                      makes the website vulnerable to window.opener API exploitation attacks

                      @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
                    */
                    global.open(clickedUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    /* otherwise just link them in the same tab */
                    global.location.assign(clickedUrl);
                  }
                }
              }
            });
          }

          return activeIframe;
        });
      }

      return Promise.resolve('');
    };

    const isDeferred =
      typeof showInAppMessagesAutomatically !== 'boolean' &&
      showInAppMessagesAutomatically.display === 'deferred';

    const triggerDisplayFn = isDeferred
      ? {
          triggerDisplayMessages: (messages: Partial<InAppMessage>[]) => {
            parsedMessages = filterHiddenInAppMessages(
              messages
            ) as InAppMessage[];

            return paintMessageToDOM();
          }
        }
      : {};

    return {
      request: (): IterablePromise<InAppMessageResponse> =>
        requestMessages()
          .then((response) => {
            trackMessagesDelivered(
              response.data.inAppMessages || [],
              dupedPayload.packageName
            );
            return response;
          })
          .then((response) => {
            if (isDeferred)
              /*
                if the user passed "deferred" for the second argument to _getMessages_
                then they're going to choose to display the in-app messages when they want
                with the returned, _triggerDisplayMessages_ function. So early return here
                with no filtering or sorting.
              */
              return response;

            /* otherwise, they're choosing to show the messages automatically */

            /* 
              if the user passed the flag to automatically paint the in-app messages
              to the DOM, start a timer and show each in-app message upon close + timer countdown
              
              However there are 3 conditions in which to not show a message:
              
              1. _read_ key is truthy
              2. _trigger.type_ key is "never" (deliver silently is checked)
              3. HTML body is blank

              so first filter out unwanted messages and sort them
            */
            clearMessages();
            parsedMessages = sortInAppMessages(
              filterHiddenInAppMessages(response.data.inAppMessages)
            ) as InAppMessage[];

            return paintMessageToDOM().then(() => {
              return {
                ...response,
                data: {
                  inAppMessages: parsedMessages
                }
              };
            });
          }),
      pauseMessageStream: () => {
        if (timer) {
          isPaused = true;
          clearTimeout(timer);
        }
      },
      resumeMessageStream: () => {
        if (isPaused) {
          isPaused = false;
          return paintMessageToDOM();
        }
      },
      ...triggerDisplayFn
    };
  }

  /* 
    user doesn't want us to paint messages automatically.
    just return the promise like normal
  */
  return requestMessages().then((response) => {
    const messages = response.data.inAppMessages;
    trackMessagesDelivered(messages || [], dupedPayload.packageName);
    const withIframes = messages?.map((message) => {
      const html = message.content?.html;
      return html
        ? _set(message, 'content.html', wrapWithIFrame(html as string))
        : message;
    });
    return {
      ...response,
      data: {
        ...response.data,
        inAppMessages: withIframes
      }
    };
  });
}
