import { WithJWT, initialize, setAnonTracking } from '@iterable/web-sdk';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import './styles/index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Link from 'src/components/Link';
import LoginForm from 'src/components/LoginForm';
import Commerce from 'src/views/Commerce';
import Events from 'src/views/Events';
import Home from 'src/views/Home';
import InApp from 'src/views/InApp';
import Users from 'src/views/Users';

import axios from 'axios';
import { UserProvider } from 'src/context/Users';

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
  const { setEmail, logout, ...rest } = process.env.NO_JWT
    ? initialize(process.env.API_KEY || '')
    : initialize(process.env.API_KEY || '', ({ email }) => {
        return axios
          .post(
            'http://localhost:5000/generate',
            {
              exp_minutes: 2,
              email,
              jwt_secret: process.env.JWT_SECRET
            },
            { headers: { 'Content-Type': 'application/json' } }
          )
          .then((response) => {
            return response.data?.token;
          });
      });
  setAnonTracking(true);

  const container = document.getElementById('app');
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
