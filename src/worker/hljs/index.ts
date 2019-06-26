import HLJSWorker from './hljs.worker';

import {HLJSWorkerMessageEvent} from './types';

const hljsWorker = new HLJSWorker();

const counter = 0;

export function highlight(language: string, value: string) {
  return new Promise<{value: string; language: string}>((resolve) => {
    const id = String(counter);
    hljsWorker.postMessage({type: 'HIGHLIGHT', value, language, id});

    const handleMessage = (event: HLJSWorkerMessageEvent) => {
      switch (event.data.type) {
        case 'HIGHLIGHT_RESPONSE': {
          if (event.data.id === id) {
            hljsWorker.removeEventListener('message', handleMessage);
            resolve({value: event.data.value, language: event.data.language});
          }
          break;
        }
      }
    };

    hljsWorker.addEventListener('message', handleMessage);
  });
}
