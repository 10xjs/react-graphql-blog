import React from 'react';
import {createGlobalStyle} from 'styled-components';

import {useHighlight} from '/util/useHighlight';

export const HighlightStyle = createGlobalStyle`${
  require('raw-loader!highlight.js/styles/atom-one-dark.css').default
}`;

interface Props {
  language: string;
  value: string;
}

export const Highlight = (props: Props) => {
  const {value, language} = useHighlight(props.language, props.value);

  return (
    <>
      <HighlightStyle />
      <pre>
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{__html: value}}
        />
      </pre>
    </>
  );
};
