import React from 'react';

import {Asset} from './reduceAssets';

const scripts = (assets: Asset[] = []): React.ReactElement[] =>
  assets
    .filter((asset) => /\.js$/.test(asset.name))
    .map((asset) => <script src={asset.url} key={asset.name} />);

const styles = (assets: Asset[] = []): React.ReactElement[] =>
  assets
    .filter((asset) => /\.css$/.test(asset.name))
    .map((asset) => (
      <link
        rel="stylesheet"
        type="text/css"
        href={asset.url}
        key={asset.name}
      />
    ));

interface PageProps {
  rootElementId: string;
  assets: Record<string, Asset[]>;
  markup: string;
  head: React.ReactChild;
  htmlAttributes: React.HTMLAttributes<HTMLElement>;
  bodyAttributes: React.HTMLAttributes<HTMLElement>;
}

const Page = ({
  rootElementId,
  assets,
  markup,
  head,
  htmlAttributes,
  bodyAttributes,
}: PageProps): React.ReactElement => (
  <html lang="en" {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      {head}
      {styles(assets.index)}
    </head>
    <body {...bodyAttributes}>
      <div
        id={rootElementId}
        className="root"
        dangerouslySetInnerHTML={{__html: markup}}
      />
      {scripts(assets.main)}
    </body>
  </html>
);

export default Page;
