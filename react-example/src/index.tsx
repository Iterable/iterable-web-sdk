import {
  InitializeParams,
  initializeWithConfig,
  WithJWT
} from '@iterable/web-sdk';
import axios, { AxiosResponse } from 'axios';
import './styles/index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from './components/Link';
import { LoginForm } from './components/LoginForm';
import AUTTesting from './views/AUTTesting';

import { UserProvider } from './context/Users';
import {
  Home,
  Commerce,
  Events,
  Users,
  InApp,
  EmbeddedMsgs,
  EmbeddedMessage,
  EmbeddedMsgsImpressionTracker
} from './views';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const RouteWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  margin: 1em;
`;

const HomeLink = styled(Link)`
  width: 100px;
`;

((): void => {
  const authToken = process.env.API_KEY || '';
  const jwtGenerator =
    process.env.JWT_GENERATOR || 'http://localhost:5000/generate';
  const jwtSecret = process.env.JWT_SECRET || '';
  const useJwt = process.env.USE_JWT === 'true';

  const initializeParams: InitializeParams = {
    authToken,
    configOptions: {
      isEuIterableService: false,
      dangerouslyAllowJsPopups: true,
      enableUnknownActivation: true,
      identityResolution: {
        replayOnVisitorToKnown: true,
        mergeOnUnknownToKnown: true
      }
    },
    ...(useJwt
      ? {
          generateJWT: ({ email, userID }: { email: string; userID: string }) =>
            axios
              .post(
                jwtGenerator,
                {
                  exp_minutes: 2,
                  email,
                  user_id: userID,
                  jwt_secret: jwtSecret
                },
                { headers: { 'Content-Type': 'application/json' } }
              )
              .then(
                (response: AxiosResponse<{ token: string }>) =>
                  response.data?.token
              )
        }
      : {})
  };
  const { setEmail, setUserID, logout, setVisitorUsageTracked, ...rest } =
    initializeWithConfig(initializeParams);

  const handleConsent = (consent?: boolean) => setVisitorUsageTracked(consent);

  const refreshJwtToken = useJwt
    ? (rest as Partial<WithJWT>).refreshJwtToken
    : undefined;

  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <Wrapper>
        <UserProvider>
          <HeaderWrapper>
            <HomeLink renderAsButton to="/">
              Home
            </HomeLink>
            <LoginForm
              setEmail={setEmail}
              setUserId={setUserID}
              logout={logout}
              refreshJwt={refreshJwtToken}
            />
          </HeaderWrapper>
          <RouteWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commerce" element={<Commerce />} />
              <Route path="/events" element={<Events />} />
              <Route path="/users" element={<Users />} />
              <Route path="/inApp" element={<InApp />} />
              <Route path="/embedded-msgs" element={<EmbeddedMsgs />} />
              <Route path="/embedded" element={<EmbeddedMessage />} />
              <Route
                path="/embedded-msgs-impression-tracker"
                element={<EmbeddedMsgsImpressionTracker />}
              />
              <Route
                path="/aut-testing"
                element={<AUTTesting setConsent={handleConsent} />}
              />
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>
  );
})();
