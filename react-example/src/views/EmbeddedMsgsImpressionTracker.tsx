import { FC, useState, useEffect, useRef } from 'react';
import {
  IterableEmbeddedCard,
  IterableEmbeddedManager,
  IterableEmbeddedMessage,
  IterableEmbeddedMessageUpdateHandler,
  IterableEmbeddedSessionManager
} from '@iterable/web-sdk';
import { useUser } from '../context/Users';

interface Props {}

export const EmbeddedMsgsImpressionTracker: FC<Props> = () => {
  const elementCardRef = useRef([]);
  const { loggedInUser } = useUser();
  const appPackageName = 'my-website';
  const [messages, setMessages] = useState([]);
  const [embeddedManager] = useState<IterableEmbeddedManager>(
    new IterableEmbeddedManager(appPackageName)
  );

  const [embeddedSessionManager] = useState<IterableEmbeddedSessionManager>(
    new IterableEmbeddedSessionManager(appPackageName)
  );

  const getCardObserver = () => {
    // Initialize visibility status for each message
    const visibilityStatus = messages.map(() => false);
    return messages.map(
      (msg: IterableEmbeddedMessage, index) =>
        new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !visibilityStatus[index]) {
              visibilityStatus[index] = true; // Update visibility status
              embeddedSessionManager.startImpression(
                msg.metadata.messageId,
                msg.metadata.placementId
              );
            }
            if (!entry.isIntersecting && visibilityStatus[index]) {
              visibilityStatus[index] = false; // Update visibility status
              embeddedSessionManager.pauseImpression(msg.metadata.messageId);
            }
          },
          {
            root: null, // viewport
            rootMargin: '0px', // no margin
            threshold: [0, 1] // 0% and 100% of target visible
          }
        )
    );
  };

  let observersCard: IntersectionObserver[] = [];

  useEffect(() => {
    observersCard = getCardObserver();

    const cleanupObservers = () => {
      observersCard.forEach((observer, index) => {
        if (elementCardRef.current[index]) {
          observer.unobserve(elementCardRef.current[index]);
        }
      });
    };

    messages.forEach((_, index) => {
      if (elementCardRef.current[index]) {
        observersCard[index].observe(elementCardRef.current[index]);
      }
    });
    return cleanupObservers;
  }, [messages]);

  useEffect(() => {
    embeddedSessionManager.startSession();
    return () => {
      embeddedSessionManager.endSession();
    };
  }, []);

  const handleFetchEmbeddedMessages = async () => {
    try {
      const updateListener: IterableEmbeddedMessageUpdateHandler = {
        onMessagesUpdated(): void {
          setMessages(embeddedManager.getMessages());
        },
        onEmbeddedMessagingDisabled(): void {
          setMessages([]);
        }
      };
      embeddedManager.addUpdateListener(updateListener);
      await embeddedManager.syncMessages('my-website', () => {
        console.log('messages', JSON.stringify(embeddedManager.getMessages()));
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (loggedInUser === '') {
      setMessages([]);
    } else {
      handleFetchEmbeddedMessages();
    }
  }, [loggedInUser]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginTop: 130
        }}
      >
        {messages.length > 0 ? (
          messages.map((message: IterableEmbeddedMessage, index: number) => {
            const data = message;
            const card = IterableEmbeddedCard({
              appPackageName,
              message: data
            });
            return (
              <div
                key={index}
                // eslint-disable-next-line no-return-assign
                ref={(el) => (elementCardRef.current[index] = el)}
                dangerouslySetInnerHTML={{ __html: card }}
              />
            );
          })
        ) : (
          <div>No message</div>
        )}
      </div>
    </>
  );
};

export default EmbeddedMsgsImpressionTracker;
