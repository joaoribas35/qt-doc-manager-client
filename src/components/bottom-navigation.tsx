import BusinessIcon from '@mui/icons-material/Business';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import { useRouter } from '@tanstack/react-router';
import type * as React from 'react';

export default function BottomNavigationComponent() {
  const router = useRouter();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.navigate({ to: '/empresas' });
        break;
      case 1:
        router.navigate({ to: '/notificacoes' });
        break;
      case 2:
        router.navigate({ to: '/perfil' });
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'white',
      }}
    >
      <BottomNavigation
        showLabels
        value={-1}
        onChange={handleTabChange}
        sx={{
          width: '100%',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white',
          mb: 2,
        }}
      >
        <BottomNavigationAction label="Empresas" icon={<BusinessIcon />} />
        <BottomNavigationAction label="Notificações" icon={<NotificationsIcon />} />
        <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
}
