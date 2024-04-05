import { WithJWT, initialize, setAnonTracking } from '@iterable/web-sdk';
import axios from 'axios';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './styles/index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Link from 'src/components/Link';
import LoginForm from 'src/components/LoginForm';
import { UserProvider } from 'src/context/Users';
import Commerce from 'src/views/Commerce';
import Events from 'src/views/Events';
import Home from 'src/views/Home';
import InApp from 'src/views/InApp';
import Users from 'src/views/Users';

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
  const requiresJwt = process.env.USE_JWT === 'true'; // Need to do a string equality check bc afaik boolean cannot be saved to env variable

  const { setEmail, logout, ...rest } = requiresJwt
    ? initialize(authToken, ({ email }) =>
        axios
          .post(
            'http://localhost:5000/generate',
            { exp_minutes: 2, email, jwt_secret: process.env.JWT_SECRET },
            { headers: { 'Content-Type': 'application/json' } }
          )
          .then((response) => response.data?.token)
      )
    : initialize(authToken);
  setAnonTracking(true);

  ReactDOM.render(
    <BrowserRouter>
      <Wrapper>
        <UserProvider>
          <HeaderWrapper>
            <HomeLink renderAsButton to="/">
              Home
            </HomeLink>
            <LoginForm
              setEmail={setEmail}
              logout={logout}
              refreshJwt={(rest as WithJWT).refreshJwtToken}
            />
          </HeaderWrapper>
          <RouteWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commerce" element={<Commerce />} />
              <Route path="/events" element={<Events />} />
              <Route path="/users" element={<Users />} />
              <Route path="/inApp" element={<InApp />} />
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>,
    document.getElementById('root')
  );
})();
