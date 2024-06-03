import { FC, FormEvent, useState } from 'react';
import styled from 'styled-components';
import _Button from 'src/components/Button';
import { EndpointWrapper, Heading, Response } from './Components.styled';
import { useUser } from 'src/context/Users';
import { getInAppMessages } from '@iterable/web-sdk';
import { AxiosError } from 'axios';

const Button = styled(_Button)`
  width: 100%;
  margin-bottom: 1em;
`;

const GetMessagesRawButton = styled(Button)`
  width: 45%;
  max-height: 61px;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

const AutoDisplayContainer = styled.div`
  width: 65%;
  margin: 0 auto;

  @media (max-width: 850px) {
    width: 85%;
  }
`;

const { request, pauseMessageStream, resumeMessageStream } = getInAppMessages(
  {
    count: 20,
    packageName: 'my-website',
    closeButton: {},
    displayInterval: 1000
  },
  { display: 'immediate' }
);

export const InApp: FC<{}> = () => {
  const [isGettingMessagesRaw, setIsGettingMessagesRaw] =
    useState<boolean>(false);
  const [isGettingMessagesAuto, setIsGettingMessagesAuto] =
    useState<boolean>(false);
  const [getMessagesResponse, setGetMessagesResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const { loggedInUser } = useUser();
  const [rawMessageCount, setRawMessageCount] = useState<number | null>(null);
  const [autoMessageCount, setAutoMessageCount] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const getMessagesRaw = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsGettingMessagesRaw(true);

    return getInAppMessages(
      { count: 20, packageName: 'my-website' },
      { display: 'deferred' }
    )
      .request()
      .then((response) => {
        setRawMessageCount(response.data.inAppMessages.length);
        setIsGettingMessagesRaw(false);
        setGetMessagesResponse(JSON.stringify(response.data, null, 2));
      })
      .catch((e) => {
        setIsGettingMessagesRaw(false);
        setGetMessagesResponse(JSON.stringify(e.response.data, null, 2));
      });
  };

  const getMessagesAutoDisplay = (e: FormEvent<HTMLButtonElement>) => {
    setIsPaused(false);
    e.preventDefault();
    setIsGettingMessagesAuto(true);

    return request()
      .then((response) => {
        setAutoMessageCount(response.data.inAppMessages.length);
        setIsGettingMessagesAuto(false);
      })
      .catch((reason: AxiosError<{ code: string; msg: string }>) => {
        const { code, msg } = reason.response.data;
        if (
          code === 'BadAuthorizationHeader' &&
          msg === 'JWT Authorization header is not set'
        )
          alert(
            'Temporary Warning (only for branch MOB-8047-nojwt): You are likely using an API key that is configured to require JWT authentication. Please use a Web API key without JWT authentication and set it in your /react-example/.env file. Then restart your sample app.'
          );

        setIsGettingMessagesAuto(false);
      });
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseMessageStream();
  };

  const handleResume = () => {
    setIsPaused(false);
    resumeMessageStream();
  };

  return (
    <>
      <h1>inApp Endpoints</h1>
      <Heading>POST /inApp/web/getMessages (auto-display)</Heading>
      <AutoDisplayContainer>
        <Button
          disabled={!loggedInUser || isGettingMessagesAuto}
          onClick={getMessagesAutoDisplay}
          data-qa-auto-display-messages
        >
          {typeof autoMessageCount === 'number'
            ? `Retrieved ${autoMessageCount} messages (try again)`
            : 'Get Messages (auto-display)'}
        </Button>
        <Button
          disabled={
            !loggedInUser ||
            isGettingMessagesAuto ||
            isPaused ||
            !autoMessageCount
          }
          onClick={handlePause}
          data-qa-pause-messages
        >
          {isPaused ? 'Paused' : 'Pause Message Stream'}
        </Button>
        <Button
          disabled={
            !loggedInUser ||
            isGettingMessagesAuto ||
            !isPaused ||
            !autoMessageCount
          }
          onClick={handleResume}
          data-qa-resume-messages
        >
          Resume Message Stream
        </Button>
      </AutoDisplayContainer>
      <Heading>POST /inApp/web/getMessages</Heading>
      <EndpointWrapper>
        <GetMessagesRawButton
          disabled={!loggedInUser || isGettingMessagesRaw}
          onClick={getMessagesRaw}
          data-qa-get-messages-raw
        >
          {typeof rawMessageCount === 'number'
            ? `Retrieved ${rawMessageCount} messages (try again)`
            : 'Get Messages (do not auto-display)'}
        </GetMessagesRawButton>
        <Response data-qa-get-messages-raw-response>
          {getMessagesResponse}
        </Response>
      </EndpointWrapper>
    </>
  );
};

export default InApp;
