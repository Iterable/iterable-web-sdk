import { FC, useState, useEffect } from 'react';
import {
  Card,
  Notification,
  Banner,
  initialize,
  EmbeddedManager,
  IterableEmbeddedMessage
} from '@iterable/web-sdk';
import Button from 'src/components/Button';
import TextField from 'src/components/TextField';

interface Props {}

export const EmbeddedMsgs: FC<Props> = () => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [userId, setUserId] = useState<string>();
  const [messages, setMessages] = useState([]);

  const changeCustomElement = () => {
    const titleElement = document.getElementById('notification-title-custom');
    const imageElement = document.getElementById('banner-image-custom');

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
      await embeddedManager.syncMessages(
        userId,
        'Web',
        '1',
        'my-website',
        () => {
          setMessages(embeddedManager.getMessages());
        }
      );
    } catch (error: any) {
      console.log('error', error);
    }
  };

  return (
    <>
      <h1>Fetch Embedded Msgs</h1>
      <label htmlFor="item-1">UserId</label>
      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        id="item-1"
        placeholder="e.g. phone_number"
        data-qa-update-user-input
        required
      />
      <Button
        style={{ marginLeft: 20, width: '100px' }}
        onClick={() => handleFetchEmbeddedMessages()}
      >
        Submit
      </Button>
      <br />
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
          messages.map((message: IterableEmbeddedMessage) => {
            const data = message;
            const notification = Notification({
              message: data,
              titleId: 'notification-title-custom',
              textStyle: `
                font-size: 20px;
              `
            });
            const banner = Banner({
              message: data,
              parentStyle: ` margin: 0; `,
              primaryBtnStyle: `
                background-color: #000fff;
                border-radius: 8px;
                padding: 10px;
                color: #ffffff;
                `,
              imageId: 'banner-image-custom'
            });
            const card = Card({
              message: data,
              parentStyle: ` margin: 0; `
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
