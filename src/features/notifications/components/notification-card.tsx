import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRouter } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { formatDueDateRelative } from '@/utils/format-date';

import type { Notification } from '../types/notification';

dayjs.locale('pt-br');

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: string) => void;
}

export function NotificationCard({ notification, onDelete }: NotificationCardProps) {
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const handleCardClick = () => {
    router.navigate({
      to: '/empresas/$company-slug/documentos/$documentId',
      params: { 'company-slug': notification.companySlug, documentId: notification.documentId },
    });
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 2,
        cursor: 'pointer',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            mb: 0.5,
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {notification.issuer}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {notification.companyName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDueDateRelative(notification.dueDate)}
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={handleDeleteClick}
        sx={{
          color: '#ccc',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
        size="small"
      >
        <DeleteIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}
