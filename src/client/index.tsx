import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';

import AppRoot from '/component/root/AppRoot';

import routerHistory from './routerHistory';

const root = document.getElementById(AppRoot.rootElementId);

if (root === null) {
  throw new Error('AppRoot root element is null');
}

const getRoot = () => {
  // eslint-disable-next-line no-undef
  const AppRoot = require('../component/root/AppRoot').default;
  return (
    <Router history={routerHistory}>
      <AppRoot />
    </Router>
  );
};

ReactDOM.hydrate(getRoot(), root);
