import React from 'react';

// @ts-ignore
import astToReact from 'react-markdown/lib/ast-to-react';
// @ts-ignore
import defaultRenderers from 'react-markdown/lib/renderers';
// @ts-ignore
import getDefinitions from 'react-markdown/lib/get-definitions';
// @ts-ignore
import transformLinkUri from 'react-markdown/lib/uri-transformer';

import {parseMarkdown} from '/module/remark';
import {parseAssetURL, AssetURLBuilder} from '/module/asset';

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

  // TODO: Size fom asset url if defined in markdown
  const size = 700;

  const url1x = new AssetURLBuilder().resize({
    width: size,
    height: size,
  });
  const url2x = new AssetURLBuilder().resize({
    width: size * 2,
    height: size * 2,
  });
  const url3x = new AssetURLBuilder().resize({
    width: size * 3,
    height: size * 3,
  });

  const src1xWEBP = url1x
    .output({format: 'webp', strip: true})
    .compress({quality: 80})
    .build(handle);

  const src2xWEBP = url2x
    .output({format: 'webp', strip: true})
    .compress({quality: 80})
    .build(handle);

  const src3xWEBP = url3x
    .output({format: 'webp', strip: true})
    .compress({quality: 80})
    .build(handle);

  const src1xJPG = url1x
    .output({format: 'jpg', strip: true})
    .compress({quality: 80})
    .build(handle);

  const src2xJPG = url2x
    .output({format: 'jpg', strip: true})
    .compress({quality: 80})
    .build(handle);

  const src3xJPG = url3x
    .output({format: 'jpg', strip: true})
    .compress({quality: 80})
    .build(handle);

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
