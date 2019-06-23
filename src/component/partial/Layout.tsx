import React from 'react';
import Helmet from 'react-helmet';

interface Props {
  children?: React.ReactNode;
  title: string;
}

const Layout = ({children, title}: Props): React.ReactElement => {
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

export default React.memo(Layout);
