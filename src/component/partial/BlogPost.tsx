import React from 'react';
import gql from 'graphql-tag';

import {useDateTimeFormat} from '/hook/intl';

import {Markdown} from '/component/partial/Markdown';

import {BlogPost_BlogPost} from '/__generated__/BlogPost_BlogPost';
export {BlogPost_BlogPost};

export const BlogPostFragments = {
  BlogPost: gql`
    fragment BlogPost_BlogPost on BlogPost {
      status
      title
      createdAt
      handle
      content
    }
  `,
};

interface Props {
  blogPost: BlogPost_BlogPost;
}

export const BlogPost = ({blogPost}: Props) => {
  return (
    <article itemScope itemType="http://schema.org/BlogPosting">
      <time dateTime={blogPost.createdAt}>
        {useDateTimeFormat(blogPost.createdAt, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>
      <h2>
        {blogPost.title}
        {blogPost.status === 'DRAFT' && ' [DRAFT]'}
      </h2>
      <Markdown source={blogPost.content} />
    </article>
  );
};
