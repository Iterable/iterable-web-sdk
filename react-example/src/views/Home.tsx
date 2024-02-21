import { FC } from 'react';
import _Link from 'src/components/Link';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Link = styled(_Link)`
  margin-top: 1em;
`;

interface Props {}

export const Home: FC<Props> = () => {
  return (
    <>
      <h1>Namespace Selection</h1>
      <Wrapper>
        <Link to="/fiterable" renderAsButton>
          Fiterable
        </Link>
        <Link to="/commerce" renderAsButton>
          Commerce
        </Link>
        <Link to="/events" renderAsButton>
          Events
        </Link>
        <Link to="/users" renderAsButton>
          Users
        </Link>
        <Link to="/inApp" renderAsButton>
          inApp
        </Link>
        <Link to="/embedded-msgs" renderAsButton>
          Embedded Msgs
        </Link>
        <Link to="/embedded" renderAsButton>
          embedded
        </Link>
      </Wrapper>
    </>
  );
};

export default Home;
