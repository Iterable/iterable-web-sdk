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
    <h1 data-test="nav-home">Namespace Selection</h1>
    <Wrapper data-test="navigation-wrapper">
      <StyledLink to="/commerce" renderAsButton data-test="nav-commerce">
        Commerce
      </StyledLink>
      <StyledLink to="/events" renderAsButton data-test="nav-events">
        Events
      </StyledLink>
      <StyledLink to="/users" renderAsButton data-test="nav-users">
        Users
      </StyledLink>
      <StyledLink to="/inApp" renderAsButton data-test="nav-inapp">
        inApp
      </StyledLink>
      {/* Note: The following components (specifically Embedded Message View Types)
      will not be supported until a later release. */}
      <StyledLink
        to="/embedded-msgs"
        renderAsButton
        data-test="nav-embedded-msgs"
      >
        Embedded Msgs
      </StyledLink>
      <StyledLink to="/embedded" renderAsButton data-test="nav-embedded">
        embedded
      </StyledLink>
      <StyledLink
        to="/embedded-msgs-impression-tracker"
        renderAsButton
        data-test="nav-embedded-msgs-tracker"
      >
        Embedded msgs impressions tracker
      </StyledLink>
      <StyledLink to="/aut-testing" renderAsButton data-test="nav-aut-testing">
        AUT Testing
      </StyledLink>
    </Wrapper>
  </>
);
