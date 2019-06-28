import {useContext} from 'react';
import {__RouterContext, RouteComponentProps} from 'react-router-dom';

export function useRouter(): RouteComponentProps {
  return useContext(__RouterContext);
}

export function useHTTPStatus(status: number) {
  const {staticContext} = useRouter();

  if (staticContext) {
    staticContext.statusCode = status;
  }
}
