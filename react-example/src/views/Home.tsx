import { FC } from 'react';
import styled from 'styled-components';
import { Link } from '../components/Link';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const StyledLink = styled(Link)`
  margin-top: 1em;
`;

interface Props {}

export const Home: FC<Props> = () => (
  <>
    <h1>Namespace Selection</h1>
    <Wrapper>
      <StyledLink to="/commerce" renderAsButton>
        Commerce
      </StyledLink>
      <StyledLink to="/events" renderAsButton>
        Events
      </StyledLink>
      <StyledLink to="/users" renderAsButton>
        Users
      </StyledLink>
      <StyledLink to="/inApp" renderAsButton>
        inApp
      </StyledLink>
      {/* Note: The following components (specifically Embedded Message View Types)
      will not be supported until a later release. */}
      <StyledLink to="/embedded-msgs" renderAsButton>
        Embedded Msgs
      </StyledLink>
      <StyledLink to="/embedded" renderAsButton>
        embedded
      </StyledLink>
      <StyledLink to="/embedded-msgs-impression-tracker" renderAsButton>
        Embedded msgs impressions tracker
      </StyledLink>
    </Wrapper>
  </>
);
