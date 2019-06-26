import React from 'react';

import {useHTTPStatus} from '/util/routerHooks';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';

export const NotFoundView = (): React.ReactElement => {
  useHTTPStatus(404);

  return (
    <Layout title="Not Found">
      <TopBar />
      <h1>Not Found</h1>
    </Layout>
  );
};
