import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

interface Props extends ButtonProps {
  isLoading: boolean;
  label: string;
  onClick?: () => void;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const LoadingButton = ({ isLoading, label, onClick, endIcon, startIcon, fullWidth, ...buttonProps }: Props) => {
  return (
    <Button
      variant="contained"
      sx={{ p: 1.5 }}
      {...buttonProps}
      aria-hidden="false"
      onClick={onClick}
      endIcon={isLoading ? undefined : endIcon}
      startIcon={isLoading ? undefined : startIcon}
      fullWidth={fullWidth}
    >
      {isLoading ? (
        <Stack direction="row" alignItems="center" gap={2}>
          <CircularProgress color="inherit" size={20} />
          carregando...
        </Stack>
      ) : (
        label
      )}
    </Button>
  );
};
