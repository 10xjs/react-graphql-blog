import React from 'react';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';

import {useDateTimeFormat} from '/util/intlHooks';

import {BlogPostPreview_BlogPost} from './__generated__/BlogPostPreview_BlogPost';

export const BlogPostPreviewFragments = {
  BlogPost: gql`
    fragment BlogPostPreview_BlogPost on BlogPost {
      title
      createdAt
      slug
    }
  `,
};

interface Props {
  blogPost: BlogPostPreview_BlogPost;
}

export const BlogPostPreview = ({blogPost: post}: Props) => {
  return (
    <article>
      <Link to={{pathname: `/post/${post.slug}`}}>
        <h2>{post.title}</h2>
      </Link>
      <time dateTime={post.createdAt}>
        {useDateTimeFormat(post.createdAt, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>
    </article>
  );
};
