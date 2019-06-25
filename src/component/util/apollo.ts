import {useQuery, QueryHookOptions} from '@apollo/react-hooks';

export function bindUseQuery<TData, TOptions>(query: any) {
  return function useBoundQuery(
    options?: QueryHookOptions<TData | {}, TOptions>,
  ) {
    return useQuery<TData | {}, TOptions>(query, options);
  };
}
