import { initializeWithConfig, WithJWTParams } from '@iterable/web-sdk';
import axios from 'axios';
import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';
import { Home } from './views/Home';
import { Commerce } from './views/Commerce';
import { Events } from './views/Events';
import { Users } from './views/Users';
import { InApp } from './views/InApp';
import { EmbeddedMessage } from './views/Embedded';
import { Link } from './components/Link';
import { LoginForm } from './components/LoginForm';
import { EmbeddedMsgs } from './views/EmbeddedMsgs';
import AUTTesting from './views/AUTTesting';

import { UserProvider } from './context/Users';
import { EmbeddedMsgsImpressionTracker } from './views/EmbeddedMsgsImpressionTracker';

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
  const initializeParams: WithJWTParams = {
    authToken: process.env.API_KEY || '',
    configOptions: {
      isEuIterableService: false,
      dangerouslyAllowJsPopups: true,
      enableAnonTracking: true
    },
    generateJWT: ({ email, userID }) =>
      axios
        .post(
          process.env.JWT_GENERATOR || 'http://localhost:5000/generate',
          {
            exp_minutes: 2,
            email,
            user_id: userID,
            jwt_secret: process.env.JWT_SECRET
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response: any) => response.data?.token)
  };
  const { setEmail, setUserID, logout, refreshJwtToken } =
    initializeWithConfig(initializeParams);

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
              <Route path="/aut-testing" element={<AUTTesting />} />
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>
  );
})();
