import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';
import {StaticRouter} from 'react-router-dom';
import {StaticContext} from 'react-router';
import {HelmetProvider, FilledContext} from 'react-helmet-async';
import {ApolloProvider} from '@apollo/react-common';
import {getDataFromTree} from '@apollo/react-hooks';
import {ApolloClient} from 'apollo-client';
import {NormalizedCacheObject} from 'apollo-cache-inmemory';
import {Stats} from 'webpack';
import nodeFetch from 'node-fetch';

import {Client} from '/apollo/Client';
import AppRoot from '/component/root/AppRoot';
import Page from './Page';
import {renderAssets} from './assets';

import {Render} from './types';

async function renderApp(
  client: ApolloClient<any>,
  location: string,
  render: (
    element: React.ReactElement,
  ) => string | Promise<string> = ReactDOMServer.renderToStaticMarkup,
) {
  const routerContext: StaticContext = {};
  const helmetContext = {};
  const serverStyleSheet = new ServerStyleSheet();

  const markup = await render(
    <StyleSheetManager sheet={serverStyleSheet.instance}>
      <HelmetProvider context={helmetContext}>
        <ApolloProvider client={client}>
          <StaticRouter location={location} context={routerContext}>
            <AppRoot />
          </StaticRouter>
        </ApolloProvider>
      </HelmetProvider>
    </StyleSheetManager>,
  );

  return {
    serverStyleSheet,
    routerContext,
    helmetContext: helmetContext as FilledContext,
    markup,
  };
}

function renderPage(
  markup: string,
  state: NormalizedCacheObject,
  helmet: FilledContext['helmet'],
  serverStyleSheet: ServerStyleSheet,
  stats: Stats.ToJsonOutput,
) {
  return ReactDOMServer.renderToStaticMarkup(
    <Page
      head={
        <>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {helmet.style.toComponent()}
          {helmet.script.toComponent()}
          {serverStyleSheet.getStyleElement()}
          {renderAssets(stats, 'main', /\.css$/)}
        </>
      }
      htmlAttributes={helmet.htmlAttributes.toComponent()}
      bodyAttributes={helmet.bodyAttributes.toComponent()}
      markup={markup}
      rootElementId={AppRoot.rootElementId}
      foot={
        <>
          <script
            id={AppRoot.stateElementId}
            type="text/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(state),
            }}
          />
          {renderAssets(stats, 'main', /\.js$/)}
        </>
      }
    />,
  );
}

const render: Render = async ({stats, path}) => {
  const location = path.replace(/index\.html$/, '');

  const client = new Client({ssrMode: true, fetch: nodeFetch as any});

  let result = await renderApp(client, location, getDataFromTree);

  const state = client.extract();

  if (result.routerContext.location === undefined) {
    result = await renderApp(client, location);
  }

  return {
    statusCode: result.routerContext.statusCode || 200,
    location: result.routerContext.location,
    markup: renderPage(
      result.markup,
      state,
      result.helmetContext.helmet,
      result.serverStyleSheet,
      stats,
    ),
  };
};

export default render;
