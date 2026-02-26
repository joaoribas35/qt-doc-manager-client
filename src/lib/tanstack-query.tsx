import { type DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type RouterContext = {
  queryClient: QueryClient;
};
