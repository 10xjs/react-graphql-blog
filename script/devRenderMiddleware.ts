import path from 'path';
import {RequestHandler} from 'express';
import webpack from 'webpack';

// @ts-ignore
import requireFromString from 'require-from-string';

// @ts-ignore
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install({
  hookRequire: true,
});

const resolveModulePath = (fs: any, modulePath: string) => {
  const filePath = path.resolve(__dirname, modulePath);
  if (!fs.statSync(filePath).isDirectory()) {
    return filePath;
  }
  return path.join(filePath, 'index.js');
};

function watchCompiler(compiler: webpack.Compiler) {
  let stats: webpack.Stats | undefined;
  let moduleCache: Map<string, any> = new Map();
  let handlers: ((stats: webpack.Stats) => void)[] = [];

  compiler.hooks.invalid.tap('watchCompiler', () => {
    stats = undefined;
    moduleCache.clear();
  });

  compiler.hooks.afterEmit.tap('watchCompiler', (compilation) => {
    const nextStats: webpack.Stats = (stats = compilation.getStats());
    handlers.forEach((handler) => handler(nextStats));
    handlers = [];
  });

  function getStats() {
    return new Promise<webpack.Stats>((resolve) => {
      if (stats) {
        resolve(stats);
      } else {
        handlers.push(resolve);
      }
    });
  }

  function getModule(fs: any, modulePath: string) {
    const filePath = resolveModulePath(fs, modulePath);

    if (moduleCache.has(filePath)) {
      return moduleCache.get(filePath);
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    const exports = requireFromString(content, filePath);
    moduleCache.set(filePath, exports);

    return exports;
  }

  return {
    stats: getStats,
    async import(modulePath: string) {
      await getStats();
      return getModule(compiler.outputFileSystem, modulePath);
    },
  };
}

function renderMiddleware(
  clientCompiler: webpack.Compiler,
  renderCompiler: webpack.Compiler,
) {
  const watchClient = watchCompiler(clientCompiler);
  const watchRender = watchCompiler(renderCompiler);

  const handler: RequestHandler = async (req, res, next) => {
    try {
      const {path} = req;

      const stats = await watchClient.stats();

      const render = await watchRender.import('../dist/render/main.js');

      const {markup, statusCode} = await render.default({
        path,
        stats: stats.toJson({
          source: false,
          chunks: false,
          modules: false,
          entrypoints: false,
          excludeAssets: (name) => /\.hot-update\./.test(name),
        }),
      });

      res.status(statusCode).send(markup);
    } catch (e) {
      next(e);
    }
  };

  return handler;
}

export default renderMiddleware;
