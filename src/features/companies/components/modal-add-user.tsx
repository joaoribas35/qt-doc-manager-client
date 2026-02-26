import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export type CompanyUserInput = {
  name: string;
  email: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (user: CompanyUserInput) => void;
}

export function ModalAddUser({ open, onClose, onAdd }: Props) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  const handleClose = () => {
    setFirstName('');
    setSurname('');
    setEmail('');
    onClose();
  };

  const handleAdd = () => {
    const name = [firstName.trim(), surname.trim()].filter(Boolean).join(' ');
    if (!name || !email.trim()) return;
    onAdd({ name, email: email.trim() });
    handleClose();
  };

  const isValid = firstName.trim() && surname.trim() && email.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ m: -2 }}
      disableRestoreFocus
      keepMounted={false}
    >
      <DialogTitle>Adicionar usuário</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField label="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth autoFocus />
          <TextField label="Sobrenome" value={surname} onChange={e => setSurname(e.target.value)} fullWidth />
          <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!isValid}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
