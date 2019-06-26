import React from 'react';
import {RouteComponentProps} from 'react-router';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import merge from 'deepmerge';

import {isNode} from '/util/platform';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';
import {BlogPost, BlogPostFragments} from '/component/partial/BlogPost';
import {
  BlogPostMeta,
  BlogPostMetaFragments,
} from '/component/partial/BlogPostMeta';

import {NotFoundView} from '/component/view/NotFoundView';

import {
  BlogPostViewQuery,
  BlogPostViewQueryVariables,
} from './__generated__/BlogPostViewQuery';
export {BlogPostViewQuery, BlogPostViewQueryVariables};

interface Params {
  handle: string;
}

interface Props extends RouteComponentProps<Params> {}

export const BlogPostView = ({match}: Props) => {
  const result = useQuery<BlogPostViewQuery, BlogPostViewQueryVariables>(
    gql`
      query BlogPostViewQuery($handle: String!) {
        blogPost(where: {handle: $handle}) {
          ...BlogPost_BlogPost
          ...BlogPostMeta_BlogPost
        }
      }
      ${BlogPostFragments.BlogPost}
      ${BlogPostMetaFragments.BlogPost}
    `,
    {
      fetchPolicy: 'cache-and-network',
      returnPartialData: !isNode,
      variables: {handle: match.params.handle},
    },
  );

  const partialData: BlogPostViewQuery = {
    blogPost: {
      title: '------',
      handle: match.params.handle,
      createdAt: '',
      publishedAt: null,
      content: '',
      description: null,
      author: null,
    },
  };

  const data = merge(partialData, result.data || {});

  if (data.blogPost) {
    return (
      <Layout title={data.blogPost.title}>
        <BlogPostMeta blogPost={data.blogPost} />
        <TopBar />
        <BlogPost blogPost={data.blogPost} />
      </Layout>
    );
  }

  return <NotFoundView />;
};
