import React from 'react';
import {Helmet} from 'react-helmet-async';
import gql from 'graphql-tag';

import {useRemarkParse} from '/util/useRemarkParse';

import {BlogPostMeta_BlogPost} from './__generated__/BlogPostMeta_BlogPost';

export const BlogPostMetaFragments = {
  BlogPost: gql`
    fragment BlogPostMeta_BlogPost on BlogPost {
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
  const ast = useRemarkParse(blogPost.content);

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

  const baseUrl = '';

  const url = `${baseUrl}/post/${blogPost.handle}`;
  return (
    <Helmet>
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
      <meta property="og:url" content={url} />
      <meta property="al:web:url" content={url} />
      <link rel="canonical" href={url} />
      {image && <meta property="og:image" content={image.url} />}
      {image && <meta name="twitter:image" content={image.url} />}
      {image && image.alt && (
        <meta name="twitter:image:alt" content={image.alt} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      {blogPost.author && (
        <meta
          property="article:author"
          content={`/people/${blogPost.author.handle}`}
        />
      )}
      {blogPost.author && (
        <link rel="author" href={`/people/${blogPost.author.handle}`} />
      )}
      {/* {blogPost.author && <meta name="twitter:creator" content="@username" />} */}
      {blogPost.author && <meta name="author" content={blogPost.author.name} />}
    </Helmet>
  );
};
