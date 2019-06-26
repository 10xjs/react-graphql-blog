import React from 'react';
import gql from 'graphql-tag';

import {
  BlogPostPreview,
  BlogPostPreviewFragments,
} from '/component/partial/BlogPostPreview';

import {
  BlogList_BlogPostConnection,
  BlogList_BlogPostConnection_edges,
} from './__generated__/BlogList_BlogPostConnection';
export {BlogList_BlogPostConnection, BlogList_BlogPostConnection_edges};

export const BlogListFramgents = {
  BlogPostsConnection: gql`
    fragment BlogList_BlogPostsConnection on BlogPostConnection {
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

    ${BlogPostPreviewFragments.BlogPost}
  `,
};

interface Props {
  blogPosts: BlogList_BlogPostConnection;
}

export const BlogList = ({blogPosts}: Props): React.ReactElement => {
  return (
    <div>
      {blogPosts.edges.map((edge) => {
        if (edge) {
          return <BlogPostPreview key={edge.node.id} blogPost={edge.node} />;
        }
        return null;
      })}
    </div>
  );
};
