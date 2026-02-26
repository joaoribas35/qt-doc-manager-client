import { createRouter } from '@tanstack/react-router';

import { routeTree } from '../routeTree.gen';

import { queryClient } from './tanstack-query';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: false,
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  trailingSlash: 'never',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface HistoryState {
    code?: string;
    title?: string;
  }
}
