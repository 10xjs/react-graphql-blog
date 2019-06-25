import {Stats} from 'webpack';
import {Location} from 'history';

interface Props {
  stats: Stats.ToJsonOutput;
  path: string;
}

interface RenderResult {
  statusCode: number;
  location?: Location;
  markup: string;
}

interface Context {
  statusCode: number;
  location?: Location;
}

declare module 'react-router' {
  export interface StaticContext extends Context {}
}

export type Render = (props: Props) => RenderResult | Promise<RenderResult>;
