import { initializeWithConfig, WithoutJWTParams } from '@iterable/web-sdk';
import ReactDOM from 'react-dom';
import './styles/index.css';

import Home from 'src/views/Home';
import Commerce from 'src/views/Commerce';
import Events from 'src/views/Events';
import Users from 'src/views/Users';
import InApp from 'src/views/InApp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Link from 'src/components/Link';
import styled from 'styled-components';
import { UserProvider } from 'src/context/Users';
import LoginFormWithoutJWT from './components/LoginFormWithoutJWT';
import AUTTesting from './views/AUTTesting';
import EmbeddedMsgs from './views/EmbeddedMsgs';
import EmbeddedMessage from './views/Embedded';
import EmbeddedMsgsImpressionTracker from './views/EmbeddedMsgsImpressionTracker';

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
  //localStorage.clear();
  // Here we are testing it using NON-JWT based project.
  const initializeParams: WithoutJWTParams = {
    authToken: process.env.API_KEY || '',
    configOptions: {
      isEuIterableService: false,
      dangerouslyAllowJsPopups: true,
      enableAnonTracking: true
    }
  };

  const { setUserID, logout, setEmail } =
    initializeWithConfig(initializeParams);

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
              <Route path="/aut-testing" element={<AUTTesting />} />
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>,
    document.getElementById('root')
  );
})();
