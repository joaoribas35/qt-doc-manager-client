import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRouter } from '@tanstack/react-router';

import { useUserStore } from '@/store/user.store';
import { UserRole } from '@/types/user.types';

import type { CompaniesSummary } from '../types/companies-summary';

interface CompanyCardProps {
  company: CompaniesSummary;
  onEdit: (company: CompaniesSummary) => void;
}

export function CompanyCard({ company, onEdit }: CompanyCardProps) {
  const router = useRouter();
  const userRole = useUserStore(state => state.user?.role);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(company);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 2,
        cursor: 'pointer',
      }}
      onClick={() => router.navigate({ to: `/empresas/${company.slug}/documentos` })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          mr: 2,
        }}
      >
        <WorkIcon sx={{ color: '#666', fontSize: 20 }} />
      </Box>

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
          {company.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {company.totalDocuments} documento{company.totalDocuments !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {userRole === UserRole.ADMIN && (
        <IconButton
          onClick={handleEditClick}
          sx={{
            color: '#ccc',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
          size="small"
        >
          <EditIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}
    </Box>
  );
}
