/// <reference types="react" />

import {GraphQL} from 'graphql-react';

declare module 'graphql-react' {
  interface GraphQLProviderProps {
    graphql: GraphQL;
    children: React.ReactNode;
  }

  export function GraphQLProvider(props: GraphQLProviderProps): JSX.Element;
}
