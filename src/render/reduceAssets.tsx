import {Stats} from 'webpack';

type Unpacked<T> = T extends (infer U)[] ? U : never;

export interface Asset
  extends Unpacked<Exclude<Stats.ToJsonOutput['assets'], undefined>> {
  url: string;
}

function reduceAssets(stats: Stats.ToJsonOutput) {
  const {assets = [], publicPath = ''} = stats;

  const rootPath = publicPath.replace(/\/+$/, '');

  const chunks: Record<string, Asset[]> = {};

  assets
    .filter((asset) => !/hot-update\.\w+$/.test(asset.name))
    .forEach((asset) => {
      asset.chunkNames.forEach((chunkName) => {
        if (!chunks[chunkName]) {
          chunks[chunkName] = [];
        }
        chunks[chunkName].push({...asset, url: `${rootPath}/${asset.name}`});
      });
    }, {});

  return chunks;
}

export default reduceAssets;
