import http from 'http';

import webpack from 'webpack';
import express from 'express';
import killable from 'killable';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import MemoryFileSystem from 'memory-fs';

import clientConfig from '../config/webpack/client';
import renderConfig from '../config/webpack/render';
import renderMiddleware from './devRenderMiddleware';
import {AddressInfo} from 'net';

clientConfig.entry.unshift('webpack-hot-middleware/client');

const clientCompiler = webpack(clientConfig as webpack.Configuration);
clientCompiler.apply(new webpack.HotModuleReplacementPlugin());

const renderCompiler = webpack(renderConfig as webpack.Configuration);
const renderWatch = renderCompiler.watch({}, (error) => {
  if (error) {
    throw error;
  }
});

const outputFs = new MemoryFileSystem();
clientCompiler.outputFileSystem = outputFs;
renderCompiler.outputFileSystem = outputFs;

const app = express();

const devMiddleware = webpackDevMiddleware(clientCompiler);
const hotMiddleware = webpackHotMiddleware(clientCompiler);

app.use(devMiddleware);
app.use(hotMiddleware);
app.use(renderMiddleware(clientCompiler, renderCompiler));

app.on('error', (error) => {
  console.error('express error', error);
  throw error;
});

const server = killable(http.createServer(app));

server.on('error', (error) => {
  throw error;
});

server.on('listening', () => {
  const address = server.address() as AddressInfo;
  console.log('listening on', address.port);
});

server.listen(8080);

let ended = false;

function handleTermination(sig: NodeJS.Signals) {
  if (!ended) {
    ended = true;

    setTimeout(() => {
      console.error('suicide');
      process.exit(1);
    }, 1000);

    console.info('\nShutting process down...');
    let count = 0;

    const callback = () => {
      count += 1;
      return () => {
        setImmediate(() => {
          count -= 1;
          if (count === 0) {
            console.info(`Process Ended via ${sig}`);
            process.exit(0);
          }
        });
      };
    };

    renderWatch.close(callback());
    devMiddleware.close(callback());
    server.kill(callback());
  }
}

process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);
