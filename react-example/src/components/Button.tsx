import { ButtonHTMLAttributes, FC } from 'react';
import styled from 'styled-components';

const _Button = styled.button`
  text-align: center;
  text-decoration: none;
  width: 60%;
  color: #000;
  font-size: 1.2em;
  background-color: #63abfb;
  border: none;
  border-radius: 5px;
  margin-top: 1em;
  padding: 1em;
  -webkit-box-shadow: 0 5px 0 0 #006be0fa;
  box-shadow: 0 5px 0 0 #006be0fa;
  -webkit-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;
  -moz-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;
  -ms-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;
  -o-transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;
  transition: box-shadow 0.05s ease 1ms transform 0.05s ease 1ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:active {
    background: #ab0457db;
    border: none;
    -webkit-box-shadow: 0 0 0 0 #006be0fa;
    box-shadow: 0 0 0 0 #006be0fa;
    -moz-transform: translateY(5px);
    -webkit-transform: translateY(5px);
    -o-transform: translateY(5px);
    -ms-transform: translateY(5px);
    transform: translateY(5px);
  }
`;

const DisabledButton = styled(_Button)`
  background-color: gray;
  color: #c7c7c7;
  -webkit-box-shadow: 0 7px 0 0 #4d4d4d;
  box-shadow: 0 7px 0 0 #4d4d4d;
  cursor: not-allowed;
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: FC<Props> = (props) => {
  const { children, disabled, ...rest } = props;
  if (disabled) {
    return (
      <DisabledButton {...rest} onClick={null} aria-disabled="true">
        {children}
      </DisabledButton>
    );
  }
  return <_Button {...rest}>{children}</_Button>;
};

export default Button;
