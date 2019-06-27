import React from 'react';
import {Helmet} from 'react-helmet-async';
import gql from 'graphql-tag';

import {parseMarkdown} from '/util/remark';
import {pathFor} from '/util/path';
import {parseAssetURL, formatAssetURL} from '/util/asset';

import {BlogPostMeta_BlogPost} from './__generated__/BlogPostMeta_BlogPost';

export const BlogPostMetaFragments = {
  BlogPost: gql`
    fragment BlogPostMeta_BlogPost on BlogPost {
      status
      title
      createdAt
      publishedAt
      description
      content
      handle
      author {
        name
        handle
      }
    }
  `,
};

function astToText(node: any, targetLength: number): string {
  if (targetLength < 1) {
    return '';
  }

  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'inlineCode') {
    return `\`${node.value}\``;
  }

  if (node.type === 'code') {
    return `\n\n\`\`\`\n${node.value}\n\`\`\``;
  }

  if (node.type === 'image') {
    return `[${node.alt}]`;
  }

  if (node.children && node.children.length) {
    if (
      node.type === 'emphasis' ||
      node.type == 'strong' ||
      node.type === 'listItem' ||
      node.type === 'underline' ||
      node.type === 'link'
    ) {
      return astToText(node.children[0], targetLength);
    }

    if (
      node.type === 'heading' ||
      node.type === 'paragraph' ||
      node.type === 'list' ||
      node.type === 'blockquote' ||
      node.type === 'root'
    ) {
      let result = '';

      for (
        let i = 0;
        i < node.children.length && result.length < targetLength;
        i++
      ) {
        const childNode = node.children[i];
        const chunk = astToText(childNode, targetLength - result.length);

        if (chunk) {
          if (
            (node.type !== 'root' || i > 0) &&
            (childNode.type === 'heading' ||
              childNode.type === 'paragraph' ||
              childNode.type === 'list')
          ) {
            result += '\n\n';
          }

          if (node.type === 'list') {
            if (i > 0) {
              result += '\n';
            }
            result += node.ordered ? `${i + 1}. ` : `- `;
            result += chunk
              .replace(/(^\s+|\s+$)/g, '')
              .replace(/(\n+)/, node.ordered ? '$1   ' : '$1  ');
          } else {
            if (
              result &&
              !/\s$/.test(result) &&
              (chunk && !/^\s/.test(chunk))
            ) {
              result += ' ';
            }
            result += chunk;
          }
        }
      }

      return result;
    }
  }

  return '';
}

function astToImage(node: any): {url: string; alt: string | null} | void {
  if (node.type === 'image') {
    return node;
  }

  if (node.children && node.children.length) {
    for (let i = 0; i < node.children.length; i++) {
      const result = astToImage(node.children[i]);
      if (result) {
        return result;
      }
    }
  }
}

interface Props {
  blogPost: BlogPostMeta_BlogPost;
}

export const BlogPostMeta = ({blogPost}: Props) => {
  const ast = parseMarkdown(blogPost.content);

  const description = React.useMemo(() => {
    if (blogPost.description) {
      return blogPost.description;
    }

    const description = astToText(ast, 200);
    if (description.length > 200) {
      return description.slice(0, 200 - 3).replace(/[\s.]*$/, '...');
    }

    return description;
  }, [blogPost.description, ast]);

  const image = React.useMemo(() => astToImage(ast), [ast]);

  const handle = image && parseAssetURL(image.url);

  const twitterImg = handle
    ? formatAssetURL(handle, [
        {type: 'resize', width: 1200, height: 675, fit: 'crop'},
        {type: 'output', format: 'jpg', strip: true},
        {type: 'compress', quality: 80},
      ])
    : image
    ? image.url
    : undefined;

  const ogImg = handle
    ? formatAssetURL(handle, [
        {type: 'resize', width: 1200, height: 1200, fit: 'clip'},
        {type: 'output', format: 'jpg', strip: true},
        {type: 'compress', quality: 80},
      ])
    : image
    ? image.url
    : undefined;

  const baseURL = '';

  return (
    <Helmet>
      {blogPost.status !== 'PUBLISHED' && (
        <meta name="robots" content="noindex" />
      )}
      <meta property="og:type" content="article" />
      <meta
        property="article:published_time"
        content={blogPost.publishedAt || blogPost.createdAt}
      />
      <meta name="title" content={blogPost.title} />
      <meta property="og:title" content={blogPost.title} />
      <meta property="twitter:title" content={blogPost.title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="twitter:description" content={description} />
      <meta property="og:url" content={baseURL + pathFor(blogPost)} />
      <meta property="al:web:url" content={baseURL + pathFor(blogPost)} />
      <link rel="canonical" href={baseURL + pathFor(blogPost)} />
      {ogImg && <meta property="og:image" content={ogImg} />}
      {twitterImg && <meta name="twitter:image" content={twitterImg} />}
      {image && image.alt && (
        <meta name="twitter:image:alt" content={image.alt} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      {blogPost.author && (
        <meta
          property="article:author"
          content={baseURL + pathFor(blogPost.author)}
        />
      )}
      {blogPost.author && (
        <link rel="author" href={baseURL + pathFor(blogPost.author)} />
      )}
      {/* {blogPost.author && <meta name="twitter:creator" content="@username" />} */}
      {blogPost.author && <meta name="author" content={blogPost.author.name} />}
    </Helmet>
  );
};
