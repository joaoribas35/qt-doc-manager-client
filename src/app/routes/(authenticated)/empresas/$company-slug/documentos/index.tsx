import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { DocumentsList } from '@/features/documents/components/documents-list';
import { CreateDocumentModal } from '@/features/documents/components/modal-create-document';
import { useUserStore } from '@/store/user.store';
import { UserRole } from '@/types/user.types';
import { formatSlugToName } from '@/utils/format-slug';

export const Route = createFileRoute('/(authenticated)/empresas/$company-slug/documentos/')({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { 'company-slug': companySlug } = Route.useParams();
  const [openCreateDocumentModal, setOpenCreateDocumentModal] = useState(false);
  const userRole = useUserStore(state => state.user?.role);
  const isAdmin = userRole === UserRole.ADMIN;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header
        title={formatSlugToName(companySlug)}
        showBackButton={true}
        showActionButton={isAdmin}
        onAddClick={() => setOpenCreateDocumentModal(true)}
      />

      <Container component="main" maxWidth="sm" sx={{ px: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 3,
            pt: 2,
          }}
        >
          Documentos
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 10 }}>
          <DocumentsList companySlug={companySlug} />
        </Box>
      </Container>

      <BottomNavigationComponent />
      <CreateDocumentModal
        open={openCreateDocumentModal}
        setOpen={setOpenCreateDocumentModal}
        companySlug={companySlug}
      />
    </Box>
  );
}
