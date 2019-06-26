import path from 'path';
import base from './base';

const baseConfig = base({target: 'web'});

export const outputPath = path.join(baseConfig.context || '', 'dist', 'client');
export const entryPath = path.join(baseConfig.context || '', 'src', 'client');

const config = {
  ...baseConfig,
  entry: [entryPath],
  output: {
    globalObject: 'this',
    path: outputPath,
    publicPath: '/',
    filename:
      process.env.NODE_ENV !== 'production'
        ? '[name].js'
        : '[name].[hash:8].js',
    chunkFilename:
      process.env.NODE_ENV !== 'production'
        ? '[name].js'
        : '[name].[chunkHash:8].js',
  },
};

export default config;
