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
        {messages.length > 0 ? (
          messages.map((message: any, index: number) => {
            const data = message?.elements;
            const primaryButton = data?.buttons?.[0];
            const secondaryButton = data?.buttons?.[1];
            const defaultAction = data?.defaultAction;

            switch (selectedButtonIndex) {
              case 0:
                return (
                  <Card
                    key={index.toString()}
                    cardStyle={{ margin: 0 }}
                    title={data?.title}
                    text={data?.body}
                    imgSrc={data?.mediaUrl}
                    primaryBtnLabel={primaryButton?.title}
                    secondaryBtnLabel={secondaryButton?.title}
                    onClickPrimaryBtn={() =>
                      handleOpenUrl(
                        primaryButton?.action?.type,
                        primaryButton?.action?.data
                      )
                    }
                    onClickSecondaryBtn={() =>
                      handleOpenUrl(
                        secondaryButton?.action?.type,
                        secondaryButton?.action?.data
                      )
                    }
                    onClickView={() =>
                      handleOpenUrl(defaultAction?.type, defaultAction?.data)
                    }
                  />
                );

              case 1:
                return (
                  <Banner
                    key={index.toString()}
                    BannerStyle={{ margin: 0 }}
                    title={data?.title}
                    text={data?.body}
                    imgSrc={data?.mediaUrl}
                    primaryBtnStyle={{
                      backgroundColor: '#000fff',
                      borderRadius: '8px',
                      padding: '10px',
                      color: '#ffffff'
                    }}
                    primaryBtnLabel={primaryButton?.title}
                    secondaryBtnLabel={secondaryButton?.title}
                    onClickPrimaryBtn={() =>
                      handleOpenUrl(
                        primaryButton?.action?.type,
                        primaryButton?.action?.data
                      )
                    }
                    onClickSecondaryBtn={() =>
                      handleOpenUrl(
                        secondaryButton?.action?.type,
                        secondaryButton?.action?.data
                      )
                    }
                    onClickView={() =>
                      handleOpenUrl(defaultAction?.type, defaultAction?.data)
                    }
                  />
                );

              case 2:
                return (
                  <Notification
                    key={index.toString()}
                    title={data?.title}
                    description={data?.body}
                    primaryButtonLabel={primaryButton?.title}
                    secondaryButtonLabel={secondaryButton?.title}
                    onClickPrimaryBtn={() =>
                      handleOpenUrl(
                        primaryButton?.action?.type,
                        primaryButton?.action?.data
                      )
                    }
                    onClickSecondaryBtn={() =>
                      handleOpenUrl(
                        secondaryButton?.action?.type,
                        secondaryButton?.action?.data
                      )
                    }
                    onClickView={() =>
                      handleOpenUrl(defaultAction?.type, defaultAction?.data)
                    }
                  />
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
