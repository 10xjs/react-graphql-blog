import React from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import merge from 'deepmerge';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';

import {BlogList, BlogListFramgents} from '/component/partial/BlogList';

import {HomeViewQuery} from './__generated__/HomeViewQuery';

const HomeViewQuery = gql`
  query HomeViewQuery {
    blogPosts: blogPostsConnection(
      where: {status: PUBLISHED}
      orderBy: createdAt_DESC
    ) {
      ...BlogList_BlogPostsConnection
    }
  }

  ${BlogListFramgents.BlogPostsConnection}
`;

export const HomeView = (): React.ReactElement => {
  const partialData: HomeViewQuery = {
    blogPosts: {
      __typename: 'BlogPostConnection',
      // pageInfo: {
      //   __typename: 'PageInfo',
      //   hasNextPage: false,
      //   hasPreviousPage: false,
      //   startCursor: null,
      //   endCursor: null,
      // },
      edges: [],
    },
  };

  const result = useQuery<HomeViewQuery, never>(HomeViewQuery);

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
