import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import BottomNavigationComponent from '@/components/bottom-navigation';
import { Header } from '@/components/header';
import { LoadingButton } from '@/components/loading-button';
import { ModalChangePassword } from '@/features/users/components/modal-change-password';
import { useLogout } from '@/hooks/use-auth';
import { useUserStore } from '@/store/user.store';

export const Route = createFileRoute('/(authenticated)/perfil/')({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useUserStore(state => state.user);
  const logoutMutation = useLogout();
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header title="Perfil" showActionButton={false} />

      <Container component="main" maxWidth="sm" sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Nome
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {user?.name || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {user?.email || '-'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Button variant="outlined" fullWidth onClick={() => setOpenChangePassword(true)}>
            Alterar senha
          </Button>

          <LoadingButton label="Sair" onClick={handleLogout} isLoading={logoutMutation.isPending} fullWidth />
        </Box>
      </Container>

      <ModalChangePassword open={openChangePassword} onClose={() => setOpenChangePassword(false)} />

      <BottomNavigationComponent />
    </Box>
  );
}
