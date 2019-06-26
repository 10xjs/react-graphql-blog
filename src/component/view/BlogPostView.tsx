import React from 'react';
import {RouteComponentProps} from 'react-router';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import merge from 'deepmerge';

import {isNode} from '/util/platform';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';
import {BlogPost, BlogPostFragments} from '/component/partial/BlogPost';

import {NotFoundView} from '/component/view/NotFoundView';

import {
  BlogPostViewQuery,
  BlogPostViewQueryVariables,
} from './__generated__/BlogPostViewQuery';
export {BlogPostViewQuery, BlogPostViewQueryVariables};

interface Params {
  slug: string;
}

interface Props extends RouteComponentProps<Params> {}

export const BlogPostView = ({match}: Props) => {
  const result = useQuery<BlogPostViewQuery, BlogPostViewQueryVariables>(
    gql`
      query BlogPostViewQuery($slug: String!) {
        blogPost(where: {slug: $slug}) {
          ...BlogPost_BlogPost
        }
      }
      ${BlogPostFragments.BlogPost}
    `,
    {
      fetchPolicy: 'cache-and-network',
      returnPartialData: !isNode,
      variables: {slug: match.params.slug},
    },
  );

  const partialData: BlogPostViewQuery = {
    blogPost: {
      title: '------',
      slug: match.params.slug,
      createdAt: 'xx ##, ####',
      content: '',
    },
  };

  const data = merge(partialData, result.data || {});

  if (data.blogPost) {
    return (
      <Layout title={data.blogPost.title}>
        <TopBar />
        <BlogPost blogPost={data.blogPost} />
      </Layout>
    );
  }

  return <NotFoundView />;
};
