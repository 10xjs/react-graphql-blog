import React from 'react';

import {hljs} from '/module/hljs';

export function useHighlight(language: string, value: string) {
  return React.useMemo(() => {
    const result = hljs.highlight(language, value);
    return {
      value: result.value,
      language: result.language,
    };
  }, [language, value]);
}
