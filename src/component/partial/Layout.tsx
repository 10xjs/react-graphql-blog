import React from 'react';
import {Helmet} from 'react-helmet-async';

interface Props {
  children?: React.ReactNode;
  title: string;
}

export const Layout = ({children, title}: Props): React.ReactElement => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
      </Helmet>
      {children}
    </>
  );
};
