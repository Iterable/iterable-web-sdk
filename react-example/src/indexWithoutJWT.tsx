import { initializeWithConfig, WithoutJWTParams } from '@iterable/web-sdk';
import ReactDOM from 'react-dom';
import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Home } from './views/Home';
import { Commerce } from './views/Commerce';
import { Events } from './views/Events';
import { Users } from './views/Users';
import { InApp } from './views/InApp';
import LoginFormWithoutJWT from './components/LoginFormWithoutJWT';
import AUTTesting from './views/AUTTesting';
import { EmbeddedMsgs } from './views/EmbeddedMsgs';
import { EmbeddedMessage } from './views/Embedded';
import { EmbeddedMsgsImpressionTracker } from './views/EmbeddedMsgsImpressionTracker';
import { Link } from './components/Link';
import { UserProvider } from './context/Users';

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
  // Here we are testing it using NON-JWT based project.
  const initializeParams: WithoutJWTParams = {
    authToken: process.env.API_KEY || '',
    configOptions: {
      isEuIterableService: false,
      dangerouslyAllowJsPopups: true,
      enableAnonTracking: true,
      onAnonUserCreated: (userId: string) => {
        console.log('onAnonUserCreated', userId);
      }
    }
  };

  const { setUserID, logout, setEmail, setVisitorUsageTracked } =
    initializeWithConfig(initializeParams);

  const handleConsent = (consent?: boolean) => setVisitorUsageTracked(consent);

  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <BrowserRouter>
      <Wrapper>
        <UserProvider>
          <HeaderWrapper>
            <HomeLink renderAsButton to="/">
              Home
            </HomeLink>
            <LoginFormWithoutJWT
              setEmail={setEmail}
              setUserId={setUserID}
              logout={logout}
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
    </BrowserRouter>,
    document.getElementById('root')
  );
})();
