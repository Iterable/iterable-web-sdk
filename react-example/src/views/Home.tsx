import { FC } from 'react';
import styled from 'styled-components';
import _Link from '../components/Link';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Link = styled(_Link)`
  margin-top: 1em;
`;

interface Props {}

export const Home: FC<Props> = () => (
  <>
    <h1>Namespace Selection</h1>
    <Wrapper>
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
      {/* Note: The following components (specifically Embedded Message View Types)
      will not be supported until a later release. */}
      <Link to="/embedded-msgs" renderAsButton>
        Embedded Msgs
      </Link>
      <Link to="/embedded" renderAsButton>
        embedded
      </Link>
      <Link to="/embedded-msgs-impression-tracker" renderAsButton>
        Embedded msgs impressions tracker
      </Link>
    </Wrapper>
  </>
);

export default Home;
