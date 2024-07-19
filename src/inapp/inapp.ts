import _set from 'lodash/set';
import { throttle } from 'throttle-debounce';
import {
  ABSOLUTE_DISMISS_BUTTON_ID,
  ANIMATION_DURATION,
  ANIMATION_STYLESHEET,
  CLOSE_X_BUTTON_ID,
  DISPLAY_INTERVAL_DEFAULT,
  ENABLE_INAPP_CONSUME,
  IS_PRODUCTION
} from '../constants';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppOpen
} from '../events';
import { IterablePromise } from '../types';
import { requestMessages } from './request';
import {
  DisplayOptions,
  GetInAppMessagesResponse,
  HandleLinks,
  InAppMessage,
  InAppMessageResponse,
  InAppMessagesRequestParams
} from './types';
import {
  addButtonAttrsToAnchorTag,
  addStyleSheet,
  filterHiddenInAppMessages,
  generateAbsoluteDismissButton,
  generateCloseButton,
  getHostnameFromUrl,
  paintIFrame,
  paintOverlay,
  setCloseButtonPosition,
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
  options: {
    display: DisplayOptions;
    /** @note parameter will be enabled once new endpoint is ready */
    // useLocalCache?: boolean;
  }
): GetInAppMessagesResponse;
export function getInAppMessages(
  payload: InAppMessagesRequestParams,
  options?: {
    display: DisplayOptions;
    /** @note parameter will be enabled once new endpoint is ready */
    // useLocalCache?: boolean;
  }
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

  if (options?.display) {
    addStyleSheet(document, ANIMATION_STYLESHEET(payload.animationDuration));
    const paintMessageToDOM = (): Promise<HTMLIFrameElement | ''> => {
      if (parsedMessages?.[messageIndex]) {
        const activeMessage = parsedMessages[messageIndex];

        const shouldAnimate =
          activeMessage?.content?.inAppDisplaySettings?.shouldAnimate;
        const messagePosition =
          activeMessage?.content?.webInAppDisplaySettings?.position || 'Center';

        const overlay = paintOverlay(
          activeMessage?.content?.inAppDisplaySettings?.bgColor?.hex,
          activeMessage?.content?.inAppDisplaySettings?.bgColor?.alpha,
          shouldAnimate
        );

        const dismissMessage = (
          activeIframe: HTMLIFrameElement,
          url?: string
        ) => {
          if (activeMessage?.content?.inAppDisplaySettings?.shouldAnimate) {
            activeIframe.className =
              messagePosition === 'Center' || messagePosition === 'Full'
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
          ).catch((e: any) => e);

          if (shouldAnimate) {
            const animationTimer = global.setTimeout(() => {
              activeIframe.remove();
              clearTimeout(animationTimer);
            }, ANIMATION_DURATION);
          } else {
            activeIframe.remove();
          }

          overlay.remove();

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

        /* add the message's html to an iframe and paint it to the DOM */
        return paintIFrame(
          activeMessage.content.html as string,
          messagePosition,
          shouldAnimate,
          payload.onOpenScreenReaderMessage || 'in-app iframe message opened',
          payload.topOffset,
          payload.bottomOffset,
          payload.rightOffset
        ).then((activeIframe) => {
          const activeIframeDocument = activeIframe?.contentDocument;

          const throttledResize =
            messagePosition !== 'Full'
              ? throttle(750, () => {
                  activeIframe.style.height =
                    (activeIframeDocument?.body?.scrollHeight || 0) + 'px';
                })
              : () => null;
          global.addEventListener('resize', throttledResize);

          try {
            const elementToFocus = activeIframeDocument?.body?.querySelector(
              payload.onOpenNodeToTakeFocus || ''
            );

            /* try to focus on the query selector the customer provided  */
            (elementToFocus as HTMLElement).focus();
          } catch (e) {
            /* otherwise, find the first focusable element and focus on that */
            const firstFocusableElement =
              activeIframeDocument?.body?.querySelector(
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
              document.removeEventListener('keydown', documentEventHandler);
              if (activeIframeDocument && !!iframeEventHandler) {
                activeIframeDocument.removeEventListener(
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

          if (activeIframeDocument) {
            activeIframeDocument.addEventListener(
              'keydown',
              handleIFrameEscPress
            );
          }

          const ua = navigator.userAgent;
          const isSafari =
            !!ua.match(/safari/i) && !ua.match(/chrome|chromium|crios/i);

          /**
           * We allow users to dismiss messages by clicking outside of the
           * message not only when isRequiredToDismissMessage is not true
           * but also when browser is detected to be Safari, regardless of
           * whether isRequiredToDismissMessage is true. Safari blocks
           * all bound event handlers and so we cannot execute Javascript
           * to listen for click events. As such, we should not prevent users
           * from being able to dismiss the message by clicking outside of it.
           */
          if (!payload.closeButton?.isRequiredToDismissMessage || isSafari) {
            overlay.addEventListener('click', () => {
              dismissMessage(activeIframe);
              document.getElementById(CLOSE_X_BUTTON_ID)?.remove();
              document.removeEventListener('keydown', handleDocumentEscPress);
              if (activeIframeDocument) {
                activeIframeDocument.removeEventListener(
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
            not the in-app message.
          */
          if (activeIframeDocument) {
            const absoluteDismissButton = generateAbsoluteDismissButton({
              id: ABSOLUTE_DISMISS_BUTTON_ID,
              document: isSafari ? document : activeIframeDocument
            });

            const triggerClose = () => {
              dismissMessage(activeIframe);
              document.removeEventListener('keydown', handleDocumentEscPress);
              if (activeIframeDocument) {
                activeIframeDocument.removeEventListener(
                  'keydown',
                  handleIFrameEscPress
                );
              }
              global.removeEventListener('resize', throttledResize);

              const closeXButtonElement =
                document.getElementById(CLOSE_X_BUTTON_ID);
              const absoluteDismissButtonElement = document.getElementById(
                ABSOLUTE_DISMISS_BUTTON_ID
              );
              closeXButtonElement?.remove();
              absoluteDismissButtonElement?.remove();
            };
            absoluteDismissButton.addEventListener('click', triggerClose);
            document.body.appendChild(absoluteDismissButton);

            /**
             * Here we paint an optional close button if the user provided configuration
             * values. This button is just a quality-of-life feature so that the customer will
             * have an easy way to close the modal outside of the other methods.
             *
             * Do not show close button if browser is detected to be Safari because the close
             * button will not be able to dismiss the message (Safari blocks JS from running
             * on bound event handlers)
             */
            if (payload.closeButton) {
              const { position, color, size, iconPath, topOffset, sideOffset } =
                payload.closeButton;

              const closeXButton = generateCloseButton(
                CLOSE_X_BUTTON_ID,
                isSafari ? document : activeIframeDocument,
                position,
                color,
                size,
                iconPath,
                topOffset,
                sideOffset
              );
              closeXButton.addEventListener('click', triggerClose);

              if (isSafari) {
                const setPosition = () =>
                  setCloseButtonPosition(
                    activeIframe,
                    closeXButton,
                    position,
                    sideOffset,
                    topOffset
                  );

                /**
                 * Due to DOM manipulations made in other timeouts when painting the iframe,
                 * getBoundingClientRect() will not work unless it waits for those manipulations
                 * to complete. Setting a trivial timeout here to account for this.
                 */
                setTimeout(() => {
                  setPosition();
                  document.body.appendChild(closeXButton);
                }, 100);

                const repositionCloseButton = () =>
                  messagePosition !== 'Full' ? setPosition() : null;
                global.addEventListener('resize', repositionCloseButton);
              } else {
                activeIframeDocument?.body.appendChild(closeXButton);
              }
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
            Promise.all(trackRequests).catch((e: any) => e);
          }

          /* now we'll add click tracking to _all_ anchor tags */
          const links = activeIframeDocument?.querySelectorAll('a') || [];

          links.forEach((link) => {
            const clickedUrl = link.getAttribute('href') || '';
            const openInNewTab = link.getAttribute('target') === '_blank';
            const isIterableKeywordLink = !!clickedUrl.match(
              /iterable:\/\/|action:\/\//gim
            );
            const isDismissNode = !!clickedUrl.match(/iterable:\/\/dismiss/gim);
            const isActionLink = !!clickedUrl.match(/action:\/\//gim);

            const clickedHostname = getHostnameFromUrl(clickedUrl);
            /* !clickedHostname means the link was relative with no hostname */
            const isInternalLink =
              clickedHostname === global.location.host || !clickedHostname;
            const { handleLinks } = payload;

            /*
              If the _handleLinks_ option is set, we need to open links
              according to that enum and override their target attributes.

              1. If _open-all-same-tab_, then open every link in the same tab
              2. If _open-all-new-tab_, then open every link in a new tab
              3. If _external-new-tab_, then open internal links in same tab, otherwise new tab.

              This was a fix to account for the fact that Bee editor templates force
              target="_blank" on all links, so we gave this option as an escape hatch for that.
            */
            const manageHandleLinks = (
              sameTabAction: () => void,
              newTabAction: () => void
            ) => {
              if (typeof handleLinks === 'string') {
                if (
                  handleLinks === HandleLinks.OpenAllSameTab ||
                  (isInternalLink && handleLinks === HandleLinks.ExternalNewTab)
                ) {
                  sameTabAction();
                } else {
                  newTabAction();
                }
              }
            };

            if (isDismissNode || isActionLink) {
              /*
                give the close anchor tag properties that make it
                behave more like a button with a logical aria label
              */
              addButtonAttrsToAnchorTag(link, 'close modal');
            }

            /**
              Safari blocks all bound event handlers (including our click event handlers)
              in iframes, so links will not work in Safari unless we circumvent the
              restriction by appending target to each link tag.

              @note Because click event handlers cannot be attached to iframe links in
              Safari, we cannot track in-app click metrics for Safari in Iterable analytics.
            */
            if (isSafari) {
              if (!isIterableKeywordLink) {
                manageHandleLinks(
                  () => link.setAttribute('target', '_top'),
                  () => {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                  }
                );
                const targetAttr = link.getAttribute('target');
                if (
                  !handleLinks &&
                  (targetAttr === null || targetAttr === '_self')
                ) {
                  link.setAttribute('target', '_top');
                }
              }
            } else {
              link.addEventListener('click', (event) => {
                /*
                  remove default linking behavior because we're in an iframe
                  so we need to link the user programatically
                */
                event.preventDefault();

                if (clickedUrl) {
                  const isOpeningLinkInSameTab = !handleLinks && !openInNewTab;
                  handleLinks === HandleLinks.OpenAllSameTab ||
                    (isInternalLink &&
                      handleLinks === HandleLinks.ExternalNewTab);

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
                  ).catch((e: any) => e);

                  if (isDismissNode || isActionLink) {
                    dismissMessage(activeIframe, clickedUrl);
                    document.removeEventListener(
                      'keydown',
                      handleDocumentEscPress
                    );
                    if (activeIframeDocument) {
                      activeIframeDocument.removeEventListener(
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
                    manageHandleLinks(
                      () => global.location.assign(clickedUrl),
                      () => {
                        global.open(
                          clickedUrl,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }
                    );
                    if (!handleLinks) {
                      if (openInNewTab) {
                        /**
                          Using target="_blank" without rel="noreferrer" and rel="noopener"
                          makes the website vulnerable to window.opener API exploitation attacks

                          @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#security_and_privacy
                        */
                        global.open(
                          clickedUrl,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      } else global.location.assign(clickedUrl);
                    }
                  }
                }
              });
            }
          });

          return activeIframe;
        });
      }

      return Promise.resolve('');
    };

    const isDeferred = options.display === DisplayOptions.Deferred;

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
        requestMessages({ payload: dupedPayload })
          .then((response: any) => {
            trackMessagesDelivered(
              response.data.inAppMessages || [],
              dupedPayload.packageName
            );
            return response;
          })
          .then((response: any) => {
            if (isDeferred) {
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

              return paintMessageToDOM().then(() => ({
                ...response,
                data: {
                  inAppMessages: parsedMessages
                }
              }));
            }
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
  return requestMessages({ payload: dupedPayload }).then((response) => {
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
