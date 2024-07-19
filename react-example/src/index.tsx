import {
  GenerateJWTPayload,
  initializeWithConfig,
  WithJWTParams
} from '@iterable/web-sdk';
import axios, { AxiosResponse } from 'axios';
import './styles/index.css';

import Home from 'src/views/Home';
import Commerce from 'src/views/Commerce';
import Events from 'src/views/Events';
import Users from 'src/views/Users';
import InApp from 'src/views/InApp';
import EmbeddedMessage from 'src/views/Embedded';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Link from 'src/components/Link';
import styled from 'styled-components';
import LoginForm from 'src/components/LoginForm';
import EmbeddedMsgs from 'src/views/EmbeddedMsgs';

import { UserProvider } from 'src/context/Users';
import { createRoot } from 'react-dom/client';
import EmbeddedMsgsImpressionTracker from './views/EmbeddedMsgsImpressionTracker';
import { string } from 'yup';

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
      dangerouslyAllowJsPopups: true
    },
    generateJWT: ({ email, userID }: GenerateJWTPayload) => {
      return (
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: AxiosResponse<Record<any, any>>) => {
            return response.data?.token;
          })
      );
    }
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
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>
  );
})();
