import { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  padding: 0.8em;
  font-size: 16px;
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const TextField: FC<Props> = (props) => {
  const { ...rest } = props;
  return <Input type="text" {...rest} />;
};

export default TextField;
