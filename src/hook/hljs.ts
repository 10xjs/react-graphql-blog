import React from 'react';

import {highlight} from '/worker/hljs';

export function useHighlight(language: string, value: string) {
  const [state, setState] = React.useState({value: '', language: ''});

  React.useEffect(() => {
    highlight(language, value).then(({value, language}) => {
      setState({value, language});
    });
  }, [language, value]);

  return state;
}
