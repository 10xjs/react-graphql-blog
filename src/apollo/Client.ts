import {ApolloClient} from 'apollo-client';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';

import config from '/../apollo.config';

interface ClientOptions {
  state?: NormalizedCacheObject;
  ssrMode?: boolean;
  fetch?: GlobalFetch['fetch'];
}

export class Client extends ApolloClient<NormalizedCacheObject> {
  constructor({state, ssrMode, fetch}: ClientOptions = {}) {
    const cache = new InMemoryCache();

    if (state !== undefined) {
      cache.restore(state);
    }

    const link = ApolloLink.from([
      new HttpLink({
        fetch,
        uri: config.client.service.url,
      }),
    ]);

    super({
      ssrMode,
      cache,
      link,
      ssrForceFetchDelay: 100,
    });
  }
}
