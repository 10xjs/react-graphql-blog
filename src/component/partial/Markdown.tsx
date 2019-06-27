import React from 'react';

// @ts-ignore
import astToReact from 'react-markdown/lib/ast-to-react';
// @ts-ignore
import defaultRenderers from 'react-markdown/lib/renderers';
// @ts-ignore
import getDefinitions from 'react-markdown/lib/get-definitions';
// @ts-ignore
import transformLinkUri from 'react-markdown/lib/uri-transformer';

import {parseMarkdown} from '/util/remark';
import {parseAssetURL, formatAssetURL} from '/util/asset';

import {Highlight} from '/component/base/Highlight';

interface ImageProps {
  key: string;
  alt?: string;
  title?: string;
  src: string;
}

const Image = ({key, src, title, alt}: ImageProps) => {
  const handle = parseAssetURL(src);

  if (!handle) {
    return <img key={key} src={src} title={title} alt={alt} />;
  }

  const size = 700;

  const src1xWEBP = formatAssetURL(handle, [
    {type: 'resize', width: size, height: size},
    {type: 'output', format: 'webp', strip: true},
    {type: 'compress', quality: 80},
  ]);
  const src2xWEBP = formatAssetURL(handle, [
    {type: 'resize', width: size * 2, height: size * 2},
    {type: 'output', format: 'webp', strip: true},
    {type: 'compress', quality: 80},
  ]);
  const src3xWEBP = formatAssetURL(handle, [
    {type: 'resize', width: size * 3, height: size * 3},
    {type: 'output', format: 'webp', strip: true},
    {type: 'compress', quality: 80},
  ]);
  const src1xJPG = formatAssetURL(handle, [
    {type: 'resize', width: size, height: size},
    {type: 'output', format: 'jpg', strip: true},
    {type: 'compress', quality: 80},
  ]);
  const src2xJPG = formatAssetURL(handle, [
    {type: 'resize', width: size * 2, height: size * 2},
    {type: 'output', format: 'jpg', strip: true},
    {type: 'compress', quality: 80},
  ]);
  const src3xJPG = formatAssetURL(handle, [
    {type: 'resize', width: size * 3, height: size * 3},
    {type: 'output', format: 'jpg', strip: true},
    {type: 'compress', quality: 80},
  ]);

  return (
    <picture key={key}>
      <source
        srcSet={`${src1xWEBP} 1x, ${src2xWEBP} 2x, ${src3xWEBP} 3x`}
        type="image/webp"
      />
      <source
        srcSet={`${src1xJPG} 1x, ${src2xJPG} 2x, ${src3xJPG} 3x`}
        type="image/jpeg"
      />
      <img src={src1xJPG} title={title} alt={alt} />
    </picture>
  );
};

function elementText(elements: React.ReactElement[]): string {
  return elements.reduce((acc, element) => {
    if (Array.isArray(element.props.children)) {
      return acc + elementText(element.props.children);
    }

    return acc + (element.props.value || '');
  }, '');
}

interface HeadingProps {
  key: string;
  level: number;
  children: React.ReactElement[];
}

const Heading = ({key, level, children}: HeadingProps) => {
  const H = `h${level}` as 'h1';

  const id = elementText(children)
    .replace(/(^\W+|\W+$)/g, '')
    .replace(/\W+/g, '-')
    .toLowerCase();

  return (
    <H key={key} id={id}>
      {children}
    </H>
  );
};

const renderers = {
  ...defaultRenderers,
  code: Highlight,
  heading: Heading,
  image: Image,
};

interface Props {
  source: string;
}

export const Markdown = ({source}: Props): JSX.Element => {
  const ast = parseMarkdown(source);

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
