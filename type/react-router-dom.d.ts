/// <reference types="react" />
/// <reference types="react-router" />

import {RouteComponentProps} from 'react-router';
import {Context} from 'react';

declare module 'react-router-dom' {
  export const __RouterContext: Context<RouteComponentProps<{}>>;
}
