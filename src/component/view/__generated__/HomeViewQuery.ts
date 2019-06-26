/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { BlogPostWhereInput, BlogPostOrderByInput } from "./../../../__generated__/schema";

// ====================================================
// GraphQL query operation: HomeViewQuery
// ====================================================

export interface HomeViewQuery_blogPosts_pageInfo {
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating backwards, are there more items?
   */
  hasPreviousPage: boolean;
  /**
   * When paginating backwards, the cursor to continue.
   */
  startCursor: string | null;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
}

export interface HomeViewQuery_blogPosts_aggregate {
  count: number;
}

export interface HomeViewQuery_blogPosts_edges_node {
  id: string;
  title: string;
  createdAt: GraphQL.DateTime;
  slug: string;
}

export interface HomeViewQuery_blogPosts_edges {
  /**
   * The item at the end of the edge.
   */
  node: HomeViewQuery_blogPosts_edges_node;
}

export interface HomeViewQuery_blogPosts {
  /**
   * Information to aid in pagination.
   */
  pageInfo: HomeViewQuery_blogPosts_pageInfo;
  aggregate: HomeViewQuery_blogPosts_aggregate;
  /**
   * A list of edges.
   */
  edges: (HomeViewQuery_blogPosts_edges | null)[];
}

export interface HomeViewQuery {
  blogPosts: HomeViewQuery_blogPosts;
}

export interface HomeViewQueryVariables {
  first?: number | null;
  skip?: number | null;
  where?: BlogPostWhereInput | null;
  orderBy?: BlogPostOrderByInput | null;
}
