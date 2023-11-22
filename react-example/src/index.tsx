import { initialize } from '@iterable/web-sdk';
import axios from 'axios';
import ReactDOM from 'react-dom';
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
  const { setEmail, logout, refreshJwtToken } = initialize(
    process.env.API_KEY || '',
    ({ email }) => {
      return axios
        .post(
          'http://localhost:5000/generate',
          {
            exp_minutes: 2,
            email,
            jwt_secret: process.env.JWT_SECRET
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          return response.data?.token;
        });
    }
  );

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
            </Routes>
          </RouteWrapper>
        </UserProvider>
      </Wrapper>
    </BrowserRouter>,
    document.getElementById('root')
  );
})();
