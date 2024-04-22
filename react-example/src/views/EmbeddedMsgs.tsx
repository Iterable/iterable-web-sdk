import { FC, useState, useEffect } from 'react';
import {
  Card,
  Notification,
  Banner,
  initialize,
  EmbeddedManager,
  IterableEmbeddedMessage,
  EmbeddedMessageUpdateHandler
} from '@iterable/web-sdk';
import Button from 'src/components/Button';
import TextField from 'src/components/TextField';
import { useUser } from 'src/context/Users';

interface Props {}

export const EmbeddedMsgs: FC<Props> = () => {
  const { loggedInUser, setLoggedInUser } = useUser();

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  const changeCustomElement = () => {
    const titleElement = document.getElementById('notification-title-custom-0');
    const imageElement = document.getElementById('banner-image-custom-1');

    if (titleElement) {
      titleElement.innerText = 'Custom title';
    }
    if (imageElement) {
      imageElement.style.height = '100px';
      imageElement.style.width = '100px';
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      changeCustomElement();
    }, 3000);

    // Clear the timeout to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, [selectedButtonIndex]);

  const handleFetchEmbeddedMessages = async () => {
    try {
      const embeddedManager = new EmbeddedManager();
      const updateListener: EmbeddedMessageUpdateHandler = {
        onMessagesUpdated: function (): void {
          setMessages(embeddedManager.getMessages());
        },
        onEmbeddedMessagingDisabled: function (): void {
          setMessages([]);
        }
      };
      embeddedManager.addUpdateListener(updateListener);
      await embeddedManager.syncMessages('Web', '1', 'my-website', () => {
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
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 80,
          marginTop: 20
        }}
      >
        <Button
          style={{
            backgroundColor: selectedButtonIndex === 0 ? '#b4246b' : '#63abfb',
            boxShadow:
              selectedButtonIndex === 0
                ? '0 5px 0 0 #5a1236'
                : '0 5px 0 0 #006be0fa'
          }}
          disabled={selectedButtonIndex === 0}
          title="Card"
          onClick={() => {
            setSelectedButtonIndex(0);
          }}
        >
          Card View
        </Button>
        <Button
          style={{
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: selectedButtonIndex === 1 ? '#b4246b' : '#63abfb',
            boxShadow:
              selectedButtonIndex === 1
                ? '0 5px 0 0 #5a1236'
                : '0 5px 0 0 #006be0fa'
          }}
          disabled={selectedButtonIndex === 1}
          title="Banner"
          onClick={() => {
            setSelectedButtonIndex(1);
          }}
        >
          Banner View
        </Button>
        <Button
          style={{
            backgroundColor: selectedButtonIndex === 2 ? '#b4246b' : '#63abfb',
            boxShadow:
              selectedButtonIndex === 2
                ? '0 5px 0 0 #5a1236'
                : '0 5px 0 0 #006be0fa'
          }}
          disabled={selectedButtonIndex === 2}
          title="Notification"
          onClick={() => {
            setSelectedButtonIndex(2);
          }}
        >
          Notification View
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        {messages.length > 0 ? (
          messages.map((message: IterableEmbeddedMessage, index: number) => {
            const data = message;
            const notification = Notification({
              message: data,
              titleId: `notification-title-custom-${index}`,
              textStyle: `
                font-size: 20px;
              `
            });
            const banner = Banner({
              message: data,
              parentStyle: ` margin-bottom: 10; `,
              primaryBtnStyle: `
                background-color: #000fff;
                border-radius: 8px;
                padding: 10px;
                color: #ffffff;
                `,
              imageId: `banner-image-custom-${index}`
            });
            const card = Card({
              message: data,
              parentStyle: ` margin-bottom: 10; `
            });
            switch (selectedButtonIndex) {
              case 0:
                return <div dangerouslySetInnerHTML={{ __html: card }} />;

              case 1:
                return <div dangerouslySetInnerHTML={{ __html: banner }} />;

              case 2:
                return (
                  <div dangerouslySetInnerHTML={{ __html: notification }} />
                );

              default:
                return null;
            }
          })
        ) : (
          <div>No message</div>
        )}
      </div>
    </>
  );
};

export default EmbeddedMsgs;
