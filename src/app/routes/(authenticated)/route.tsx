import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { useUserStore } from '@/store/user.store';

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: async () => {
    const isAuthenticated = useUserStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: AuthenticatedLayoutComponent,
});

function AuthenticatedLayoutComponent() {
  return (
    <>
      <Outlet />
      <BottomNavigationComponent />
    </>
  );
}
