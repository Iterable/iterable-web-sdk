import { throttle } from 'throttle-debounce';
import {
  InAppMessage,
  InAppMessagesRequestParams,
  InAppMessageResponse
} from './types';
import { IterablePromise } from '../types';
import { baseIterableRequest } from '../request';
import {
  addButtonAttrsToAnchorTag,
  addStyleSheet,
  filterHiddenInAppMessages,
  getHostnameFromUrl,
  paintIFrame,
  paintOverlay,
  sortInAppMessages,
  trackMessagesDelivered
} from './utils';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppOpen
} from '../events';
import {
  ANIMATION_DURATION,
  ANIMATION_STYLESHEET,
  DISPLAY_INTERVAL_DEFAULT,
  ENABLE_INAPP_CONSUME,
  IS_PRODUCTION,
  SDK_VERSION,
  WEB_PLATFORM
} from 'src/constants';
import schema from './inapp.schema';

let parsedMessages: InAppMessage[] = [];
let timer: NodeJS.Timeout | null = null;
let messageIndex = 0;

export const clearMessages = () => {
  parsedMessages = [];
  messageIndex = 0;
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
  showInAppMessagesAutomatically?: boolean
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

          /* close the message and start a timer to show the next one */
          trackInAppClose(
            url
              ? {
                  messageId: activeMessage.messageId,
                  clickedUrl: url,
                  deviceInfo: {
                    appPackageName: dupedPayload.packageName
                  }
                }
              : {
                  messageId: activeMessage.messageId,
                  deviceInfo: { appPackageName: dupedPayload.packageName }
                }
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
          activeMessage.content.html,
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

          const handleEscKeypress = (event: KeyboardEvent, doc: Document) => {
            if (event.key === 'Escape') {
              dismissMessage(activeIframe);
              overlay.remove();
              doc.removeEventListener('keydown', (event) =>
                handleEscKeypress(event, doc)
              );
              global.removeEventListener('resize', throttledResize);
            }
          };

          document.addEventListener('keydown', (event) =>
            handleEscKeypress(event, document)
          );

          if (activeIframe?.contentWindow?.document) {
            activeIframe.contentWindow?.document.addEventListener(
              'keydown',
              (event) =>
                handleEscKeypress(
                  event,
                  (activeIframe.contentWindow as Window).document
                )
            );
          }

          overlay.addEventListener('click', () => {
            dismissMessage(activeIframe);
            overlay.remove();
            document.removeEventListener('keydown', (event) =>
              handleEscKeypress(event, document)
            );
            global.removeEventListener('resize', throttledResize);
          });

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
            absoluteDismissButton.addEventListener('click', () => {
              dismissMessage(activeIframe);
              overlay.remove();
              document.removeEventListener('keydown', (event) =>
                handleEscKeypress(event, document)
              );
              global.removeEventListener('resize', throttledResize);
            });
            activeIframe.contentWindow.document.body.appendChild(
              absoluteDismissButton
            );
          }

          /* 
            track in-app consumes only when _saveToInbox_ 
            is falsy or undefined and always track in-app opens

            Also swallow any 400+ response errors. We don't care about them.
          */
          if (ENABLE_INAPP_CONSUME || IS_PRODUCTION) {
            Promise.all(
              !activeMessage?.saveToInbox
                ? [
                    trackInAppOpen({
                      messageId: activeMessage.messageId,
                      deviceInfo: {
                        appPackageName: payload.packageName
                      }
                    }),
                    trackInAppConsume({
                      messageId: activeMessage.messageId,
                      deviceInfo: {
                        appPackageName: payload.packageName
                      }
                    })
                  ]
                : [
                    trackInAppOpen({
                      messageId: activeMessage.messageId,
                      deviceInfo: {
                        appPackageName: payload.packageName
                      }
                    })
                  ]
            ).catch((e) => e);
          }

          /* now we'll add click tracking to _all_ anchor tags */
          const links =
            activeIframe.contentWindow?.document?.querySelectorAll('a') || [];

          for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const clickedUrl = link.getAttribute('href') || '';
            const openInNewTab = link.getAttribute('target') === '_blank';
            const isIterableKeywordLink = !!clickedUrl.match(
              /itbl:\/\/|iterable:\/\/|action:\/\//gim
            );
            const isDismissNode = !!clickedUrl.match(
              /(itbl:\/\/|iterable:\/\/)dismiss/gim
            );

            if (isDismissNode) {
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
                trackInAppClick({
                  clickedUrl,
                  messageId: activeMessage?.messageId,
                  deviceInfo: {
                    appPackageName: dupedPayload.packageName
                  }
                  /* swallow the network error */
                }).catch((e) => e);

                if (isDismissNode) {
                  dismissMessage(activeIframe, clickedUrl);
                  overlay.remove();
                  document.removeEventListener('keydown', (event) =>
                    handleEscKeypress(event, document)
                  );
                  global.removeEventListener('resize', throttledResize);
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
                    const clickedHostname = getHostnameFromUrl(clickedUrl);
                    const isInternalLink =
                      clickedHostname === global.location.host;

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

    return {
      request: (): IterablePromise<InAppMessageResponse> =>
        baseIterableRequest<InAppMessageResponse>({
          method: 'GET',
          url: '/inApp/getMessages',
          validation: {
            params: schema
          },
          params: {
            ...dupedPayload,
            platform: WEB_PLATFORM,
            SDKVersion: SDK_VERSION
          }
        })
          .then((response) => {
            trackMessagesDelivered(
              response.data.inAppMessages || [],
              dupedPayload.packageName
            );
            return response;
          })
          .then((response) => {
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
          clearTimeout(timer);
        }
      },
      resumeMessageStream: () => {
        return paintMessageToDOM();
      }
    };
  }

  /* 
    user doesn't want us to paint messages automatically.
    just return the promise like normal
  */
  return baseIterableRequest<InAppMessageResponse>({
    method: 'GET',
    url: '/inApp/getMessages',
    validation: {
      params: schema
    },
    params: {
      ...dupedPayload,
      platform: WEB_PLATFORM,
      SDKVersion: SDK_VERSION
    }
  }).then((response) => {
    trackMessagesDelivered(
      response.data.inAppMessages || [],
      dupedPayload.packageName
    );
    return response;
  });
}
