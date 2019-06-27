/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomeViewQuery
// ====================================================

export interface HomeViewQuery_blogPosts_edges_node {
  __typename: "BlogPost";
  id: string;
  title: string;
  createdAt: GraphQL.DateTime;
  publishedAt: GraphQL.DateTime | null;
  handle: string;
}

export interface HomeViewQuery_blogPosts_edges {
  __typename: "BlogPostEdge";
  /**
   * The item at the end of the edge.
   */
  node: HomeViewQuery_blogPosts_edges_node;
}

export interface HomeViewQuery_blogPosts {
  __typename: "BlogPostConnection";
  /**
   * A list of edges.
   */
  edges: (HomeViewQuery_blogPosts_edges | null)[];
}

export interface HomeViewQuery {
  blogPosts: HomeViewQuery_blogPosts;
}
