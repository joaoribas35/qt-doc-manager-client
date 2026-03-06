import Box from '@mui/material/Box';
import { red, yellow } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { useRouter } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { constants } from '@/utils/constants';
import { formatDate } from '@/utils/format-date';

import type { Document } from '../types/document';

function getDueDateBackgroundColor(dueDate: string): string {
  const due = dayjs(dueDate).startOf('day');
  const today = dayjs().startOf('day');
  const daysUntilDue = due.diff(today, 'day');

  if (daysUntilDue < 0) return red[200];
  if (daysUntilDue <= 30) return yellow[50];

  return 'white';
}

interface Props {
  companySlug: string;
  document: Document;
}

export function DocumentCard({ document, companySlug }: Props) {
  const router = useRouter();
  const backgroundColor = getDueDateBackgroundColor(document.dueDate ?? '');

  return (
    <Box
      key={document.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor,
        padding: 2,
        borderRadius: 2,
        cursor: 'pointer',
      }}
      onClick={() => router.navigate({ to: `/empresas/${companySlug}/documentos/${document.id}` })}
    >
      {/* Document Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          textTransform: 'capitalize',
        }}
      >
        {document.name ? document.name : constants.fieldUndefined}
      </Typography>

      {/* Document Details */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 0.5,
          textTransform: 'capitalize',
        }}
      >
        {document.issuer ? document.issuer : constants.fieldUndefined}
      </Typography>

      {/* Due Date and Status */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          Vence em: {document.dueDate ? formatDate(document.dueDate) : constants.fieldUndefined}
        </Typography>
      </Box>
    </Box>
  );
}
