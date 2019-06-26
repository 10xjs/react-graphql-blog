import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {ApolloProvider} from '@apollo/react-common';

import {Client} from '/apollo/Client';

import {AppRoot} from '/component/root/AppRoot';

const rootElement = document.getElementById(AppRoot.rootElementId);

if (rootElement === null) {
  throw new Error('AppRoot root element is null');
}

const stateElement = document.getElementById(AppRoot.stateElementId);
const state =
  stateElement !== null
    ? (() => {
        try {
          return JSON.parse(stateElement.innerHTML);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      })()
    : undefined;

const client = new Client({state});

const getRoot = () => {
  // eslint-disable-next-line no-undef
  const {AppRoot} = require('../component/root/AppRoot');

  return (
    <HelmetProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <AppRoot />
        </BrowserRouter>
      </ApolloProvider>
    </HelmetProvider>
  );
};

ReactDOM.hydrate(getRoot(), rootElement);
