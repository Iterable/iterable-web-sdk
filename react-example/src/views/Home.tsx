import { FC } from 'react';
import Link from 'src/components/Link';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

interface Props {}

export const Home: FC<Props> = () => {
  return (
    <>
      <h1>Namespace Selection</h1>
      <Wrapper>
        <Link to="/commerce" renderAsButton>
          Commerce
        </Link>
      </Wrapper>
    </>
  );
};

export default Home;
