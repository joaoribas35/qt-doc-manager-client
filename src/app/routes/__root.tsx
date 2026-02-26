import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { queryClient } from '../../lib/tanstack-query';
import { NotFound } from '../not-found';

interface RootContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  loader: () => {
    return {
      queryClient,
    };
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  pendingComponent: () => <div>Loading...</div>,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
