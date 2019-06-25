/// <reference types="webpack" />

declare module 'pages-webpack-plugin' {
  import webpack from 'webpack';

  interface Result {
    markup: string;
    redirect?: string;
    status?: number;
  }

  interface Props {
    path: string;
  }

  interface Options<R, P> {
    mapStatsToProps(stats: webpack.Stats): P;
    render(props: Props & P): Promise<R> | R;
    mapResults?: (
      results: (R & {filename: string; path: string})[],
      compilation: webpack.compilation.Compilation,
    ) => (R & {filename: string; path: string})[];
    mapResultToFilename?: (result: R & {path: string}) => string;
    paths?: string[];
    parsePathsFromMarkup?: (markup: string) => string[];
  }

  class PagesPlugin<R extends Result, P> {
    constructor(options: Options<R, P>);
  }

  export = PagesPlugin;
}
