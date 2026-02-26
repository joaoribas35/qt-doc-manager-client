import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useGetNotifications } from '../hooks/use-get-notifications';

import { NotificationCard } from './notification-card';

interface NotificationsListProps {
  onDelete: (id: string) => void;
}

dayjs.locale('pt-br');

export function NotificationsList({ onDelete }: NotificationsListProps) {
  const { data, isLoading, isError, isSuccess } = useGetNotifications();

  if (isLoading)
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 1 }} />
        ))}
      </>
    );

  if (isError) return <Typography variant="body1">Erro ao carregar as notificações</Typography>;
  if (!isSuccess) return <Typography variant="body1">Algo errado aconteceu ao carregar as notificações</Typography>;

  if (!data || data.length === 0) {
    return <Typography variant="body1">Nenhuma notificação</Typography>;
  }

  return (
    <>
      {data.map(notification => (
        <NotificationCard key={notification.id} notification={notification} onDelete={onDelete} />
      ))}
    </>
  );
}
