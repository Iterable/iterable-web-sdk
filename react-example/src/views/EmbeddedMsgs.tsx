import { FC, useState, useEffect } from 'react';
import {
  Card,
  Notification,
  Banner,
  initialize,
  EmbeddedManager
} from '@iterable/web-sdk';
import Button from 'src/components/Button';
import TextField from 'src/components/TextField';
import { IterableActionSource, IterableActionRunner } from '@iterable/web-sdk';

interface Props {}

export const EmbeddedMsgs: FC<Props> = () => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [userId, setUserId] = useState<string>();
  const [messages, setMessages] = useState([]);
  const iterableActionRunner = new IterableActionRunner();

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

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

  const handleOpenUrl = (clickedUrl: string, data: string) => {
    const iterableAction = {
      type: clickedUrl,
      data
    };

    iterableActionRunner.executeAction(
      null,
      iterableAction,
      IterableActionSource.EMBEDDED
    );
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
        style={{ marginLeft: 20, width: '10%' }}
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
        {selectedButtonIndex === 0 &&
          messages.length &&
          messages.map((message: any, index: number) => (
            <Card
              key={index.toString()}
              cardStyle={{ margin: 0 }}
              title={message?.elements?.title}
              text={message?.elements?.body}
              imgSrc={message?.elements?.mediaUrl}
              primaryBtnLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 0
                  ? message?.elements?.buttons[0]?.title
                  : undefined
              }
              secondaryBtnLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 1
                  ? message?.elements?.buttons[1]?.title
                  : undefined
              }
              onClickPrimaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[0]?.action?.type,
                  message?.elements?.buttons[0]?.action?.data
                );
              }}
              onClickSecondaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[1]?.action?.type,
                  message?.elements?.buttons[1]?.action?.data
                );
              }}
              onClickView={() => {
                handleOpenUrl(
                  message?.elements?.defaultAction?.type,
                  message?.elements?.defaultAction?.data
                );
              }}
            />
          ))}

        {selectedButtonIndex === 1 &&
          messages.length &&
          messages.map((message: any, index: number) => (
            <Banner
              key={index.toString()}
              BannerStyle={{ margin: 0 }}
              title={message?.elements?.title}
              text={message?.elements?.body}
              imgSrc={message?.elements?.mediaUrl}
              primaryBtnStyle={{
                backgroundColor: '#000fff',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff'
              }}
              primaryBtnLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 0
                  ? message?.elements?.buttons[0]?.title
                  : undefined
              }
              secondaryBtnLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 1
                  ? message?.elements?.buttons[1]?.title
                  : undefined
              }
              onClickPrimaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[0]?.action?.type,
                  message?.elements?.buttons[0]?.action?.data
                );
              }}
              onClickSecondaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[1]?.action?.type,
                  message?.elements?.buttons[1]?.action?.data
                );
              }}
              onClickView={() => {
                handleOpenUrl(
                  message?.elements?.defaultAction?.type,
                  message?.elements?.defaultAction?.data
                );
              }}
            />
          ))}

        {selectedButtonIndex === 2 &&
          messages.length &&
          messages.map((message: any, index: number) => (
            <Notification
              key={index.toString()}
              title={message?.elements?.title}
              description={message?.elements?.body}
              primaryButtonLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 0
                  ? message?.elements?.buttons[0]?.title
                  : undefined
              }
              secondaryButtonLabel={
                message?.elements?.buttons &&
                message?.elements?.buttons.length > 1
                  ? message?.elements?.buttons[1]?.title
                  : undefined
              }
              onClickPrimaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[0]?.action?.type,
                  message?.elements?.buttons[0]?.action?.data
                );
              }}
              onClickSecondaryBtn={() => {
                handleOpenUrl(
                  message?.elements?.buttons[1]?.action?.type,
                  message?.elements?.buttons[1]?.action?.data
                );
              }}
              onClickView={() => {
                handleOpenUrl(
                  message?.elements?.defaultAction?.type,
                  message?.elements?.defaultAction?.data
                );
              }}
            />
          ))}
      </div>
    </>
  );
};

export default EmbeddedMsgs;
