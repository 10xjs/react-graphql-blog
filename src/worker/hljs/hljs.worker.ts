import {hljs} from '/module/hljs';
import {RollingMap} from '/module/collection';

import {HLJSWorker} from './types';

const context: HLJSWorker = self as any;

const cache = new RollingMap<string, hljs.IHighlightResult>(10);

function highlight(language: string, value: string) {
  const key = language + value;

  if (cache.has(key)) {
    return cache.get(key) as hljs.IHighlightResult;
  }

  const result = hljs.highlight(language, value);

  cache.set(key, result);

  return result;
}

context.addEventListener('message', (event) => {
  switch (event.data.type) {
    case 'HIGHLIGHT': {
      const {value, language, id} = event.data;
      const result = highlight(language, value);
      context.postMessage({
        type: 'HIGHLIGHT_RESPONSE',
        value: result.value,
        language: result.language,
        id,
      });
      break;
    }
  }
});

export default HLJSWorker;
