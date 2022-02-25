import './styles/index.css';
import axios from 'axios';
import Home from 'src/views/Home';
import Commerce from 'src/views/Commerce';
import Events from 'src/views/Events';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Link from 'src/components/Link';
import styled from 'styled-components';

import { initialize } from '@iterable/web-sdk';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const RouteWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
`;

const HomeLink = styled(Link)`
  align-self: flex-end;
  width: 100px;
  margin: 1em;
`;

((): void => {
  const { setEmail } = initialize(process.env.API_KEY || '', ({ email }) => {
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
  });

  setEmail('iterable.tester@gmail.com');
  ReactDOM.render(
    <BrowserRouter>
      <Wrapper>
        <HomeLink renderAsButton to="/">
          Home
        </HomeLink>
        <RouteWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commerce" element={<Commerce />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </RouteWrapper>
      </Wrapper>
    </BrowserRouter>,
    document.getElementById('root')
  );
})();
