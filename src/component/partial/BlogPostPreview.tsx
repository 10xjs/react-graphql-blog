import React from 'react';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';

import {useDateTimeFormat} from '/util/intlHooks';

import {BlogPostPreview_BlogPost} from './__generated__/BlogPostPreview_BlogPost';
export {BlogPostPreview_BlogPost};

export const BlogPostPreviewFragments = {
  BlogPost: gql`
    fragment BlogPostPreview_BlogPost on BlogPost {
      title
      createdAt
      slug
    }
  `,
};

const BlogPostPrefetchQuery = gql`
  query BlogPostPrefetchQuery($slug: String!) {
    blogPost(where: {slug: $slug}) {
      ...BlogPostPreview_BlogPost
    }
  }
  ${BlogPostPreviewFragments.BlogPost}
`;

interface Props {
  blogPost: BlogPostPreview_BlogPost;
}

export const BlogPostPreview = ({blogPost}: Props) => {
  useQuery(BlogPostPrefetchQuery, {variables: {slug: blogPost.slug}});

  return (
    <article>
      <Link to={{pathname: `/post/${blogPost.slug}`}}>
        <h2>{blogPost.title}</h2>
      </Link>
      <time dateTime={blogPost.createdAt}>
        {useDateTimeFormat(blogPost.createdAt, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>
    </article>
  );
};
