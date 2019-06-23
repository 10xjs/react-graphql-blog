import path from 'path';
import base from './base';

const baseConfig = base({target: 'web'});

const outputPath = path.join(baseConfig.context || '', 'dist', 'client');
const entryPath = path.join(baseConfig.context || '', 'src', 'client');

const config = {
  ...baseConfig,
  entry: [entryPath],
  output: {
    path: outputPath,
    publicPath: '/',
    filename:
      process.env.NODE_ENV !== 'production'
        ? '[name].js'
        : '[name].[chunkHash:8].js',
    chunkFilename:
      process.env.NODE_ENV !== 'production'
        ? '[name].js'
        : '[name].[chunkHash:8].js',
  },
};

export default config;
