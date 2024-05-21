import { FC, useState, useEffect } from 'react';
import {
  IterableEmbeddedCard,
  IterableEmbeddedNotification,
  IterableEmbeddedBanner,
  IterableEmbeddedManager,
  IterableEmbeddedMessage,
  IterableEmbeddedMessageUpdateHandler,
  IterableUrlHandler,
  IterableCustomActionHandler,
  IterableAction,
  IterableConfig
} from '@iterable/web-sdk';
import Button from 'src/components/Button';
import { useUser } from 'src/context/Users';

const StyleOverrides = {
  parent: {
    id: 'parent-id',
    styles: `
      background: white;
      border-color: purple;
      border-radius: 30px;
      padding: 10px;
    `
  },
  img: {
    id: 'img-id',
    styles: ''
  },
  title: {
    id: 'title-id',
    styles: `
      color: green;
    `
  },
  primaryButton: {
    id: 'primary-button-id',
    styles: `
      color: #8B0000;
      background: #FFFFFF;
    `
  },
  secondaryButton: {
    id: 'secondary-button-id',
    styles: '',
    disabledStyles: `
        opacity: .6;
        cursor: not-allowed;
        background: grey;
        color: grey;
      `
  },
  body: {
    id: 'body-id',
    styles: `
      color: green;
    `
  },
  buttonsDiv: {
    id: 'buttons-div-id',
    styles: ''
  }
};

interface Props {}

export const EmbeddedMsgs: FC<Props> = () => {
  const { loggedInUser } = useUser();
  const appPackageName = 'my-website';
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [useCustomStyles, setUseCustomStyles] = useState(false);

  const [messages, setMessages] = useState([]);

  const [embeddedManager] = useState(
    new IterableEmbeddedManager(appPackageName)
  );

  useEffect(() => {
    const urlHandler: IterableUrlHandler = {
      handleIterableURL: function (uri: string): boolean {
        window.open(uri, '_blank');
        return true;
      }
    };
    IterableConfig.urlHandler = urlHandler;

    const customActionHandler: IterableCustomActionHandler = {
      handleIterableCustomAction: function (action: IterableAction): boolean {
        if (action.data === 'news') {
          // handle the custom action here and navigate based on action data
          return true;
        }
        return false;
      }
    };
    IterableConfig.customActionHandler = customActionHandler;
  }, []);

  const handleFetchEmbeddedMessages = async () => {
    try {
      const updateListener: IterableEmbeddedMessageUpdateHandler = {
        onMessagesUpdated: function (): void {
          // this callback gets called when messages are fetched/updated
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
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <form>
          <div>
            <input
              type="radio"
              id="default"
              name="default"
              value="default"
              checked={!useCustomStyles}
              onChange={() => setUseCustomStyles(false)}
            />
            <label>Default OOTB Styles</label>
          </div>
          <div>
            <input
              type="radio"
              id="custom"
              name="custom"
              value="custom"
              checked={useCustomStyles}
              onChange={() => setUseCustomStyles(true)}
            />
            <label>Custom OOTB Styles</label>
          </div>
        </form>
      </div>
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
            switch (selectedButtonIndex) {
              case 0: {
                const card = IterableEmbeddedCard({
                  appPackageName,
                  message,
                  ...(useCustomStyles && StyleOverrides),
                  errorCallback: (error) => console.log('handleError: ', error)
                });
                return (
                  <div
                    key={message.metadata.messageId}
                    dangerouslySetInnerHTML={{ __html: card }}
                  />
                );
              }

              case 1: {
                const banner = IterableEmbeddedBanner({
                  appPackageName,
                  message,
                  ...(useCustomStyles && StyleOverrides),
                  errorCallback: (error) => console.log('handleError: ', error)
                });
                return (
                  <div
                    key={message.metadata.messageId}
                    dangerouslySetInnerHTML={{ __html: banner }}
                  />
                );
              }

              case 2: {
                const notification = IterableEmbeddedNotification({
                  appPackageName,
                  message,
                  ...(useCustomStyles && StyleOverrides),
                  errorCallback: (error) => console.log('handleError: ', error)
                });
                return (
                  <div
                    key={message.metadata.messageId}
                    dangerouslySetInnerHTML={{ __html: notification }}
                  />
                );
              }

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
