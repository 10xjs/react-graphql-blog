import React from 'react';

// @ts-ignore
import astToReact from 'react-markdown/lib/ast-to-react';
// @ts-ignore
import defaultRenderers from 'react-markdown/lib/renderers';
// @ts-ignore
import getDefinitions from 'react-markdown/lib/get-definitions';
// @ts-ignore
import transformLinkUri from 'react-markdown/lib/uri-transformer';

import {useRemarkParse} from '/util/useRemarkParse';

import {Highlight} from '/component/base/Highlight';

interface HeadingProps {
  level: number;
  children: React.ReactElement[];
}

function elementText(elements: React.ReactElement[]): string {
  return elements.reduce((acc, element) => {
    if (Array.isArray(element.props.children)) {
      return acc + elementText(element.props.children);
    }

    return acc + (element.props.value || '');
  }, '');
}

const Heading = ({level, children}: HeadingProps) => {
  const H = `h${level}` as 'h1';

  const id = elementText(children)
    .replace(/(^\W+|\W+$)/g, '')
    .replace(/\W+/g, '-')
    .toLowerCase();

  return <H id={id}>{children}</H>;
};

const renderers = {
  ...defaultRenderers,
  code: Highlight,
  heading: Heading,
};

interface Props {
  source: string;
}

export const Markdown = ({source}: Props): JSX.Element => {
  const ast = useRemarkParse(source);

  return React.useMemo(
    () =>
      astToReact(ast, {
        skipHtml: true,
        transformLinkUri,
        renderers,
        definitions: getDefinitions(ast),
      }),
    [ast],
  );
};
