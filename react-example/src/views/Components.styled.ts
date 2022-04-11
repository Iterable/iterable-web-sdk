import styled from 'styled-components';
import _Button from 'src/components/Button';

export const Form = styled.form`
  display: flex;
  flex-flow: column;
  width: 45%;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

export const Response = styled.pre`
  width: 45%;
  white-space: break-spaces;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

export const EndpointWrapper = styled.div`
  display: flex;
  flex-flow: row;
  width: 100%;
  justify-content: space-between;
`;

export const Heading = styled.h2`
  margin-top: 3em;
`;

export const Button = styled(_Button)`
  margin-top: 1em;
`;
