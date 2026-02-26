import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import TagIcon from '@mui/icons-material/Tag';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { LoadingButton } from '@/components/loading-button';
import { downloadDocument } from '@/features/documents/api/download-document';
import { EditDocumentModal } from '@/features/documents/components/modal-edit-document';
import { useGetDocumentById } from '@/features/documents/hooks/use-get-document-by-id';
import { useUserStore } from '@/store/user.store';
import { UserRole } from '@/types/user.types';
import { formatDate, formatDateWithWeekday } from '@/utils/format-date';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

export const Route = createFileRoute('/(authenticated)/empresas/$company-slug/documentos/$documentId')({
  component: DocumentDetailsPage,
});

function DocumentDetailsPage() {
  const { documentId, 'company-slug': companySlug } = Route.useParams();
  const { data: document, isLoading, isError, isSuccess } = useGetDocumentById(documentId);
  const [openEditDocumentModal, setOpenEditDocumentModal] = useState(false);
  const userRole = useUserStore(state => state.user?.role);
  const isAdmin = userRole === UserRole.ADMIN;
  const handleDownload = async () => {
    if (!document) return;

    try {
      const fileExtension = document.path?.split('.').pop() || 'pdf';
      const filename = `${document.name}.${fileExtension}`;
      await downloadDocument(document.id, filename);
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Header title="Detalhes do Documento" showBackButton={true} onAddClick={() => {}} />
        <Container component="main" maxWidth="sm" sx={{ px: 2 }}>
          <Skeleton variant="text" width="60%" height={48} sx={{ mb: 0, pt: 2 }} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
          </Paper>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 4 }} />
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2, mb: 10 }} />
        </Container>
        <BottomNavigationComponent />
      </Box>
    );

  if (isError) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Header title="Detalhes do Documento" showBackButton={true} onAddClick={() => {}} />
        <Container component="main" maxWidth="sm" sx={{ px: 2, pt: 2 }}>
          <Typography variant="body1">Erro ao carregar o documento</Typography>
        </Container>
        <BottomNavigationComponent />
      </Box>
    );
  }

  if (!isSuccess || !document) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Header title="Detalhes do Documento" showBackButton={true} onAddClick={() => {}} />
        <Container component="main" maxWidth="sm" sx={{ px: 2, pt: 2 }}>
          <Typography variant="body1">Algo errado aconteceu ao carregar o documento</Typography>
        </Container>
        <BottomNavigationComponent />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header
        title="Detalhes do Documento"
        showBackButton={true}
        showEditButton={isAdmin}
        showActionButton={isAdmin}
        onAddClick={() => setOpenEditDocumentModal(true)}
      />

      <Container component="main" maxWidth="sm" sx={{ px: 2, pb: 12 }}>
        {/* Document Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            pt: 2,
            textTransform: 'capitalize',
          }}
        >
          {document.name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textTransform: 'capitalize' }}>
          {document.companyName}
        </Typography>

        {/* Document Information Card */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          {/* Issuer */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
              <DescriptionIcon sx={{ color: '#666', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Emissor
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {document.issuer}
              </Typography>
            </Box>
          </Box>

          {/* Document Number */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
              <TagIcon sx={{ color: '#666', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Número do Documento
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {document.number}
              </Typography>
            </Box>
          </Box>

          {/* Issue Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
              <CalendarTodayIcon sx={{ color: '#666', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Data de Emissão
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                {formatDate(document.issueDate)}
              </Typography>
            </Box>
          </Box>

          {/* Due Date */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <EventBusyIcon sx={{ color: '#f44336', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Data de Vencimento
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#f44336', textTransform: 'capitalize' }}>
                {formatDateWithWeekday(document.dueDate)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Remarks Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Observações
        </Typography>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {document.remarks}
          </Typography>
        </Paper>

        {/* Download Button */}
        <LoadingButton
          isLoading={false}
          label="Baixar documento"
          type="button"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          fullWidth
        >
          Baixar documento
        </LoadingButton>
      </Container>

      <BottomNavigationComponent />
      <EditDocumentModal
        open={openEditDocumentModal}
        setOpen={setOpenEditDocumentModal}
        document={document}
        companySlug={companySlug}
      />
    </Box>
  );
}
