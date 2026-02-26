import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { CompaniesList } from '@/features/companies/components/companies-list';
import { CreateCompanyModal } from '@/features/companies/components/modal-create-company';
import { EditCompanyModal } from '@/features/companies/components/modal-edit-company';
import type { CompaniesSummary } from '@/features/companies/types/companies-summary';
import { useUserStore } from '@/store/user.store';
import { UserRole } from '@/types/user.types';

export const Route = createFileRoute('/(authenticated)/empresas/')({
  component: CompaniesPage,
});

function CompaniesPage() {
  const [openCreateCompanyModal, setOpenCreateCompanyModal] = useState(false);
  const [openEditCompanyModal, setOpenEditCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompaniesSummary | null>(null);
  const userRole = useUserStore(state => state.user?.role);

  const isAdmin = userRole === UserRole.ADMIN;

  const handleEditCompany = (company: CompaniesSummary) => {
    setSelectedCompany(company);
    setOpenEditCompanyModal(true);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header title="Empresas" onAddClick={() => setOpenCreateCompanyModal(true)} showActionButton={isAdmin} />

      <Container component="main" maxWidth="sm" sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2, pb: 10 }}>
          <CompaniesList onEdit={handleEditCompany} />
        </Box>
      </Container>

      <BottomNavigationComponent />
      {isAdmin && <CreateCompanyModal open={openCreateCompanyModal} setOpen={setOpenCreateCompanyModal} />}
      {isAdmin && (
        <EditCompanyModal open={openEditCompanyModal} setOpen={setOpenEditCompanyModal} company={selectedCompany} />
      )}
    </Box>
  );
}
