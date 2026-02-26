import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { Header } from '@/components/header';
import { NotificationsList } from '@/features/notifications/components/notifications-list';
import { useDeleteNotification } from '@/features/notifications/hooks/use-delete-notification';
import { useGetNotifications } from '@/features/notifications/hooks/use-get-notifications';

export const Route = createFileRoute('/(authenticated)/notificacoes/')({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<{ messageId: string; name: string } | null>(null);
  const { data: notifications } = useGetNotifications();
  const deleteMutation = useDeleteNotification();

  const handleDelete = (messageId: string) => {
    const notification = notifications?.find(n => n.messageId === messageId);
    setNotificationToDelete({
      messageId,
      name: notification?.name ?? 'esta notificação',
    });
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      deleteMutation.mutate(notificationToDelete.messageId, {
        onSuccess: () => {
          setOpenDeleteConfirm(false);
          setNotificationToDelete(null);
        },
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header title="Notificações" showActionButton={false} />

      <Container component="main" maxWidth="sm" sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2, pb: 10 }}>
          <NotificationsList onDelete={handleDelete} />
        </Box>
      </Container>

      <BottomNavigationComponent />
      <ConfirmDeleteDialog
        open={openDeleteConfirm}
        onClose={() => {
          setOpenDeleteConfirm(false);
          setNotificationToDelete(null);
        }}
        itemName={notificationToDelete?.name || 'esta notificação'}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
