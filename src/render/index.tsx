import React from 'react';
import {Stats} from 'webpack';
import ReactDOMServer from 'react-dom/server';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';
import {StaticRouter} from 'react-router-dom';
import Helmet from 'react-helmet';
import {Location} from 'history';

import AppRoot from '/component/root/AppRoot';
import Page from './Page';
import reduceAssets from './reduceAssets';

interface RenderConfig {
  stats: Stats.ToJsonOutput;
  path: string;
}

type RenderResult =
  | {
      status: number;
      location: string;
    }
  | {
      status: number;
      markup: string;
    };

interface RouterContext {
  statusCode: number;
  location?: Location;
}

declare module 'react-router' {
  export interface StaticRouterContext extends RouterContext {}
}

const render = ({stats, path}: RenderConfig): RenderResult => {
  const routerContext: RouterContext = {statusCode: 200};

  const location = path.replace(/index\.html$/, '');

  const sheet = new ServerStyleSheet();

  const markup = ReactDOMServer.renderToStaticMarkup(
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter location={location} context={routerContext}>
        <AppRoot />
      </StaticRouter>
    </StyleSheetManager>,
  );

  const style = sheet.getStyleElement();

  const helmet = Helmet.renderStatic();

  return {
    status: routerContext.statusCode,
    location,
    markup:
      routerContext.location === undefined
        ? `<!doctype html>${ReactDOMServer.renderToStaticMarkup(
            <Page
              assets={reduceAssets(stats)}
              head={
                <>
                  {helmet.title.toComponent()}
                  {helmet.meta.toComponent()}
                  {helmet.link.toComponent()}
                  {helmet.style.toComponent()}
                  {helmet.script.toComponent()}
                  {style}
                </>
              }
              htmlAttributes={helmet.htmlAttributes.toComponent()}
              bodyAttributes={helmet.bodyAttributes.toComponent()}
              markup={markup}
              rootElementId={AppRoot.rootElementId}
            />,
          )}`
        : '',
  };
};

export default render;
