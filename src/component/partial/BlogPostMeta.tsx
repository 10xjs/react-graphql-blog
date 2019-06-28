import React from 'react';
import {Helmet} from 'react-helmet-async';
import gql from 'graphql-tag';

import {parseMarkdown, astToImage, astToText} from '/module/remark';
import {pathFor} from '/module/path';
import {parseAssetURL, AssetURLBuilder} from '/module/asset';

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

interface Props {
  blogPost: BlogPostMeta_BlogPost;
}

const twitterImageURL = new AssetURLBuilder()
  .resize({
    width: 1200,
    height: 675,
    fit: 'crop',
  })
  .output({format: 'jpg', strip: true})
  .compress({quality: 80});

const ogImageURL = new AssetURLBuilder()
  .resize({
    width: 1200,
    height: 1200,
    fit: 'clip',
  })
  .output({format: 'jpg', strip: true})
  .compress({quality: 80});

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

  const twitterImage = handle
    ? twitterImageURL.build(handle)
    : image
    ? image.url
    : undefined;

  const ogImage = handle
    ? ogImageURL.build(handle)
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
      {ogImage && <meta property="og:image" content={ogImage} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
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
