import { FC } from 'react';
import { Link as _Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';

const _ButtonLink = styled(_Link)`
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

const DisabledButtonLink = styled(_ButtonLink)`
  background-color: gray;
  color: #c7c7c7;
  -webkit-box-shadow: 0 7px 0 0 #4d4d4d;
  box-shadow: 0 7px 0 0 #4d4d4d;
  cursor: not-allowed;

  &:active {
    background-color: gray;
    color: #c7c7c7;
    -webkit-box-shadow: 0 7px 0 0 #4d4d4d;
    box-shadow: 0 7px 0 0 #4d4d4d;
    cursor: not-allowed;
  }
`;

interface Props extends LinkProps {
  renderAsButton?: boolean;
  disabled?: boolean;
}

export const Link: FC<Props> = (props) => {
  const { children, disabled, renderAsButton, ...rest } = props;
  if (disabled && renderAsButton) {
    return (
      <DisabledButtonLink {...rest} to="#" aria-disabled="true">
        {children}
      </DisabledButtonLink>
    );
  }

  if (renderAsButton) {
    return <_ButtonLink {...rest}>{children}</_ButtonLink>;
  }

  return <_Link {...rest}>{children}</_Link>;
};

export default Link;
