import { FC, useState, useEffect, useRef } from 'react';
import {
  Card,
  EmbeddedManager,
  IterableEmbeddedMessage,
  EmbeddedMessageUpdateHandler,
  EmbeddedSessionManager,
  EmbeddedMessage
} from '@iterable/web-sdk';
import { useUser } from 'src/context/Users';

interface Props { }

const embeddedSessionManager = new EmbeddedSessionManager('my-website');

export const EmbeddedMsgsImpressionTracker: FC<Props> = () => {
  const elementCardRef = useRef([]);
  const { loggedInUser, setLoggedInUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [embeddedManager] = useState<EmbeddedManager>(
    new EmbeddedManager('my-website')
  );

  const getCardObserver = () => {
    const visibilityStatus = messages.map(() => false); // Initialize visibility status for each message
    return messages.map(
      (msg: EmbeddedMessage, index) =>
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

  let observersCard: any[] = [];

  useEffect(() => {
    observersCard = getCardObserver();

    const cleanupObservers = () => {
      observersCard.forEach((observer, index) => {
        if (elementCardRef.current[index]) {
          observer.unobserve(elementCardRef.current[index]);
        }
      });
    };

    messages.forEach((message, index) => {
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
      const updateListener: EmbeddedMessageUpdateHandler = {
        onMessagesUpdated: function (): void {
          setMessages(embeddedManager.getMessages());
        },
        onEmbeddedMessagingDisabled: function (): void {
          setMessages([]);
        }
      };
      embeddedManager.addUpdateListener(updateListener);
      await embeddedManager.syncMessages('my-website', () => {
        console.log('messages', JSON.stringify(embeddedManager.getMessages()));
      });
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
            const card = Card({
              embeddedManager,
              message: data,
              parentStyle: ' margin-bottom: 10; '
            });
            return (
              <div
                key={index}
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
