import React from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';

import {
  BlogPostPreview,
  BlogPostPreviewFragments,
} from '/component/partial/BlogPostPreview';

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
          id
          ...BlogPostPreview_BlogPost
        }
      }
    }
  }

  ${BlogPostPreviewFragments.BlogPost}
`;

export const HomeView = (): React.ReactElement => {
  const result = useQuery<HomeViewQuery, HomeViewQueryVariables>(
    HomeViewQuery,
    {
      variables: {
        orderBy: BlogPostOrderByInput.createdAt_ASC,
      },
    },
  );

  return (
    <Layout title="Home">
      <TopBar />
      <main>
        {result.data && !result.loading
          ? result.data.blogPosts.edges.map((edge) => {
              return (
                <BlogPostPreview key={edge!.node.id} blogPost={edge!.node} />
              );
            })
          : 'loading'}
      </main>
    </Layout>
  );
};
