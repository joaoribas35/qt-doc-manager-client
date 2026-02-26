import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditIcon from '@mui/icons-material/Edit';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useRouter } from '@tanstack/react-router';

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
  showBackButton?: boolean;
  showEditButton?: boolean;
  showActionButton?: boolean;
}

export function Header({
  title,
  onAddClick,
  showBackButton = false,
  showEditButton = false,
  showActionButton = true,
}: HeaderProps) {
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="sm">
        <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
          <IconButton
            onClick={() => router.history.back()}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' },
              visibility: showBackButton ? 'visible' : 'hidden',
              width: 40,
              height: 40,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>

          {showActionButton && (
            <IconButton
              onClick={onAddClick}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
                width: 40,
                height: 40,
              }}
            >
              {showEditButton ? <EditIcon /> : <AddIcon />}
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
