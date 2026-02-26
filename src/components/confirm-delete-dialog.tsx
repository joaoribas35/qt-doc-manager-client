import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  itemName,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ m: -2 }}>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir <strong>{itemName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
