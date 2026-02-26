import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import type { CreateCompanyUserInput } from '../api/create-company';
import { useCreateCompany } from '../hooks/use-create-company';

import { ModalAddUser, type CompanyUserInput } from './modal-add-user';

const schema = z.object({
  name: z.string().min(1, { message: 'campo obrigatório' }),
});

export type CreateCompanyFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateCompanyModal({ open, setOpen }: Props) {
  const mutation = useCreateCompany();
  const [users, setUsers] = useState<CompanyUserInput[]>([]);
  const [openAddUser, setOpenAddUser] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(schema as never),
  });

  const onSubmit = async (data: CreateCompanyFormData) => {
    const input: { name: string; users?: CreateCompanyUserInput[] } = {
      name: data.name,
    };
    if (users.length > 0) {
      input.users = users.map(u => ({ name: u.name, email: u.email }));
    }

    try {
      await mutation.mutateAsync(input);
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleClose = () => {
    reset();
    setUsers([]);
    setOpenAddUser(false);
    setOpen(false);
  };

  const handleAddUser = (user: CompanyUserInput) => {
    setUsers(prev => [...prev, user]);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{ m: -2 }}
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogTitle>Adicionar Empresa</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Nome da empresa"
              multiline
              {...register('name')}
              fullWidth
              error={!!errors['name']}
              helperText={errors['name'] ? errors['name'].message : ''}
            />

            {users.length > 0 && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Usuários
                </Typography>
                <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
                  {users.map((user, index) => (
                    <ListItem
                      key={`${user.email}-${index}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveUser(index)}
                          aria-label="remover usuário"
                        >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      }
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <VisibilityIcon sx={{ fontSize: 20 }} color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.name}
                        secondary={user.email}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '1rem',
                          },
                          '& .MuiListItemText-secondary': {
                            fontSize: '0.8rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <IconButton onClick={() => setOpenAddUser(true)}>
            <PersonAddIcon sx={{ color: 'primary.main' }} />
          </IconButton>

          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained" type="submit" disabled={mutation.isPending}>
              Adicionar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ModalAddUser open={openAddUser} onClose={() => setOpenAddUser(false)} onAdd={handleAddUser} />
    </>
  );
}
