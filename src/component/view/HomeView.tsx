import React from 'react';
import gql from 'graphql-tag';
import {useQuery, QueryHookOptions} from '@apollo/react-hooks';

import Layout from '/component/partial/Layout';
import TopBar from '/component/partial/TopBar';

import {
  HomeViewQuery,
  HomeViewQueryVariables,
} from './__generated__/HomeViewQuery';

const query = gql`
  query HomeViewQuery(
    $first: Int
    $skip: Int
    $where: BlogPostWhereInput
    $orderBy: BlogPostOrderByInput
  ) {
    posts: blogPostsConnection(
      first: $first
      skip: $skip
      where: $where
      orderBy: $orderBy
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      aggregate {
        count
      }
      edges {
        node {
          status
          updatedAt
          createdAt
          id
          title
          content
          slug
        }
      }
    }
  }
`;

const HomeView = (): React.ReactElement => {
  const result = useQuery<HomeViewQuery, HomeViewQueryVariables>(query);

  return (
    <Layout title="Home">
      <TopBar />
      <h1>Home</h1>
      {result.data && !result.loading
        ? result.data.blogPosts.edges.map((edge) => {
            return <h2 key={edge!.node.id}>{edge!.node.title}</h2>;
          })
        : 'loading'}
    </Layout>
  );
};

export default React.memo(HomeView);
