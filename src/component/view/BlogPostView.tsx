import React from 'react';
import {RouteComponentProps} from 'react-router';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import {Layout} from '/component/partial/Layout';
import {TopBar} from '/component/partial/TopBar';
import {BlogPost, BlogPostFragments} from '/component/partial/BlogPost';

import {
  BlogPostViewQuery,
  BlogPostViewQueryVariables,
} from './__generated__/BlogPostViewQuery';

const BlogPostViewQuery = gql`
  query BlogPostViewQuery($slug: String!) {
    blogPost(where: {slug: $slug}) {
      ...BlogPost_BlogPost
    }
  }
  ${BlogPostFragments.BlogPost}
`;

interface Params {
  slug: string;
}

interface Props extends RouteComponentProps<Params> {}

export const BlogPostView = ({match}: Props) => {
  const result = useQuery<BlogPostViewQuery, BlogPostViewQueryVariables>(
    BlogPostViewQuery,
    {
      variables: {slug: match.params.slug},
    },
  );

  const blogPost =
    result.data && result.data.blogPost
      ? result.data.blogPost
      : {
          title: '------',
          slug: match.params.slug,
          createdAt: 'xx ##, ####',
          content: '',
        };

  return (
    <Layout title={blogPost.title}>
      <TopBar />
      <BlogPost blogPost={blogPost} />
    </Layout>
  );
};
