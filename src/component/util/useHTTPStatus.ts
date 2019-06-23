import useRouter from '/component/util/useRouter';

function useHTTPStatus(status: number) {
  const {staticContext} = useRouter();

  if (staticContext) {
    staticContext.statusCode = status;
  }
}

export default useHTTPStatus;
