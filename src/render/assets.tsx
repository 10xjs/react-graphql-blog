import React from 'react';
import {Stats} from 'webpack';

export function renderAssets(
  stats: Stats.ToJsonOutput,
  chunk: string,
  nameRegex: RegExp,
) {
  const {assets, publicPath = ''} = stats;

  const rootPath = publicPath.replace(/\/+$/, '');

  const elements: JSX.Element[] = [];

  if (!assets) {
    throw new Error('Webpack stats must inlclude assets.');
  }

  assets.forEach((asset) => {
    if (
      !/hot-update\.\w+$/.test(asset.name) &&
      nameRegex.test(asset.name) &&
      asset.chunkNames.includes(chunk)
    ) {
      switch (asset.name.split('.').pop()) {
        case 'css':
          elements.push(
            <link
              key={asset.name}
              rel="stylesheet"
              type="text/css"
              href={`${rootPath}/${asset.name}`}
            />,
          );
          break;
        case 'js':
          elements.push(
            <script key={asset.name} src={`${rootPath}/${asset.name}`} />,
          );
          break;
      }
    }
  });

  return elements;
}
