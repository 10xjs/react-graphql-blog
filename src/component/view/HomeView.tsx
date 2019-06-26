import React from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import merge from 'deepmerge';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';

import {BlogList, BlogListFramgents} from '/component/partial/BlogList';

import {BlogPostOrderByInput} from '../../__generated__/schema';

import {
  HomeViewQuery,
  HomeViewQueryVariables,
} from './__generated__/HomeViewQuery';

const HomeViewQuery = gql`
  query HomeViewQuery(
    $first: Int
    $skip: Int
    $where: BlogPostWhereInput
    $orderBy: BlogPostOrderByInput
  ) {
    blogPosts: blogPostsConnection(
      first: $first
      skip: $skip
      where: $where
      orderBy: $orderBy
    ) {
      ...BlogList_BlogPostsConnection
    }
  }

  ${BlogListFramgents.BlogPostsConnection}
`;

export const HomeView = (): React.ReactElement => {
  const partialData: HomeViewQuery = {
    blogPosts: {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      aggregate: {
        count: 0,
      },
      edges: [],
    },
  };

  const result = useQuery<HomeViewQuery, HomeViewQueryVariables>(
    HomeViewQuery,
    {
      variables: {
        orderBy: BlogPostOrderByInput.createdAt_DESC,
      },
    },
  );

  const data = merge(partialData, result.data || {});

  return (
    <Layout title="Home">
      <TopBar />
      <main>
        <BlogList blogPosts={data.blogPosts} />
      </main>
    </Layout>
  );
};
