// @ts-ignore
import unified from 'unified';
// @ts-ignore
import remarkParse from 'remark-parse';

import {RollingMap} from '/util/RollingMap';

const parser = unified().use(remarkParse);

const cache = new RollingMap<string, ReturnType<typeof parser.parse>>(10);

export function useRemarkParse(source: string) {
  if (cache.has(source)) {
    return cache.get(source);
  }

  const ast = parser.parse(source);

  cache.set(source, ast);

  return ast;
}
