import { FC, useState } from 'react';
import { Card } from '@iterable/web-sdk';

interface Props {}

export const EmbeddedMsgs: FC<Props> = () => {
  const [messages, setMessages] = useState([
    {
      placementId: '23223314',
      placementType: 'carousel',
      messages: [
        {
          metadata: {
            id: 'jub9845-3948jviu-934rouifjfj',
            campaignId: '903f-59bjg-3eijv',
            isProof: false
          },

          elements: {
            type: 'custom',
            buttons: [
              { id: 'reward-button', title: 'Get Reward', action: 'success' },
              { id: 'dismiss-button', title: 'Dismiss', action: 'dismiss' }
            ],
            images: [
              {
                id: 'image-background',
                url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_dark_color_272x92dp.png'
              },
              {
                id: 'image-reward-button',
                url: 'https://example-image-url.com/second-image'
              },
              {
                id: 'image-dismiss-button',
                url: 'https://example-image-url.com/third-image'
              }
            ],
            text: [
              { id: 'title', text: 'TITLE!!' },
              { id: 'body', text: 'lots of words here' }
            ]
          },
          payload: {
            'key or other valid JSON key':
              'any valid JSON value goes here, not just a string',
            numbers: [1, 2, 3]
          }
        }
      ]
    },
    {
      placementId: '23223314',
      placementType: 'carousel',
      messages: [
        {
          metadata: {
            id: 'jub9845-3948jviu-934rouifjfj',
            campaignId: '903f-59bjg-3eijv',
            isProof: false
          },

          elements: {
            type: 'custom',
            buttons: [
              { id: 'reward-button', title: 'Get Reward', action: 'success' },
              { id: 'dismiss-button', title: 'Dismiss', action: 'dismiss' }
            ],
            images: [
              {
                id: 'image-background',
                url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_dark_color_272x92dp.png'
              },
              {
                id: 'image-reward-button',
                url: 'https://example-image-url.com/second-image'
              },
              {
                id: 'image-dismiss-button',
                url: 'https://example-image-url.com/third-image'
              }
            ],
            text: [
              { id: 'title', text: 'Domo 2' },
              { id: 'body', text: 'lots of words here 222' }
            ]
          },
          payload: {
            'key or other valid JSON key':
              'any valid JSON value goes here, not just a string',
            numbers: [1, 2, 3]
          }
        }
      ]
    }
  ]);

  return (
    <>
      <h1>Fetch Embedded Msgs</h1>
      <div>
        {messages.length &&
          messages.map((message: any, index: number) => (
            <Card
              key={index.toString()}
              text={message.messages[0].text[0].text}
              title={message.messages[0].text[1].text}
              imgSrc={message.messages[0].images[0].url}
            />
          ))}
      </div>
    </>
  );
};

export default EmbeddedMsgs;
