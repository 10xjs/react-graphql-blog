import React from 'react';
import {NavLink} from 'react-router-dom';
import styled, {StyledComponentAttributes} from 'styled-components';

const Root = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
`;

const TopBar = (props: StyledComponentAttributes<typeof Root>) => {
  return (
    <Root {...props}>
      <NavLink to={{pathname: '/'}}>Home</NavLink>{' '}
      <NavLink to={{pathname: '/about'}}>About</NavLink>{' '}
      <NavLink to={{pathname: '/contact'}}>Contact</NavLink>{' '}
    </Root>
  );
};

export default React.memo(TopBar);
