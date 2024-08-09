import styled from 'styled-components';
import { Button } from '../components/Button';

export const Form = styled.form`
  display: flex;
  flex-flow: column;
  width: 45%;

  @media (max-width: 850px) {
    width: 100%;
    margin-bottom: 2em;
  }
`;

export const Response = styled.pre`
  width: 45%;
  white-space: break-spaces;
  overflow-x: auto;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

export const EndpointWrapper = styled.div`
  display: flex;
  flex-flow: row;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 850px) {
    display: block;
  }
`;

export const Heading = styled.h2`
  margin-top: 3em;
`;

export const StyledButton = styled(Button)`
  margin-top: 1em;
`;

export { Button };
