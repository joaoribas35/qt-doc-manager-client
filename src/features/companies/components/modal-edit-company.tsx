import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import { useDeleteCompany } from '../hooks/use-delete-company';
import { useGetCompanyById } from '../hooks/use-get-company-by-id';
import { useUpdateCompany } from '../hooks/use-update-company';
import type { CompaniesSummary } from '../types/companies-summary';

import { ModalAddUser, type CompanyUserInput } from './modal-add-user';

const schema = z.object({
  name: z.string().min(1, { message: 'campo obrigatório' }),
});

export type EditCompanyFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  company: CompaniesSummary | null;
}

export function EditCompanyModal({ open, setOpen, company }: Props) {
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [markedForDeletionIds, setMarkedForDeletionIds] = useState<Set<string>>(new Set());
  const [usersToAdd, setUsersToAdd] = useState<CompanyUserInput[]>([]);

  const { data: fullCompany, isLoading: isLoadingCompany } = useGetCompanyById(company?.id ?? null, open && !!company);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<EditCompanyFormData>({
    resolver: zodResolver(schema as never),
  });

  useEffect(() => {
    if (company && open) {
      setValue('name', company.name);
    }
  }, [company, open, setValue]);

  const onSubmit = async (data: EditCompanyFormData) => {
    if (!company || !fullCompany) return;

    const usersToKeep = (fullCompany.users ?? []).filter(user => !markedForDeletionIds.has(user.id));

    const users = [
      ...usersToKeep.map(user => ({ id: user.id, name: user.name, email: user.email })),
      ...usersToAdd.map(u => ({ name: u.name, email: u.email })),
    ];

    const input = {
      id: company.id,
      name: data.name,
      users,
    };

    try {
      await updateMutation.mutateAsync(input);
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleDelete = async () => {
    if (!company) return;

    try {
      await deleteMutation.mutateAsync(company.id);
      setOpenDeleteConfirm(false);
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
    setOpenDeleteConfirm(false);
    setOpenAddUser(false);
    setMarkedForDeletionIds(new Set());
    setUsersToAdd([]);
  };

  const handleAddUser = (user: CompanyUserInput) => {
    setUsersToAdd(prev => [...prev, user]);
  };

  const handleRemoveAddedUser = (index: number) => {
    setUsersToAdd(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteClick = () => {
    setOpenDeleteConfirm(true);
  };

  const handleToggleUserDeletion = (userId: string) => {
    setMarkedForDeletionIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  if (!company) return null;

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
        <DialogTitle>Editar Empresa</DialogTitle>
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

            {((fullCompany?.users?.length ?? 0) > 0 || usersToAdd.length > 0) && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Usuários da empresa
                </Typography>
                <List dense disablePadding>
                  {fullCompany?.users?.map(user => {
                    const isMarked = markedForDeletionIds.has(user.id);

                    return (
                      <ListItem
                        key={user.id}
                        onClick={() => handleToggleUserDeletion(user.id)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor: isMarked ? 'error.light' : 'action.hover',
                          color: isMarked ? 'error.contrastText' : 'inherit',
                          '&:hover': {
                            bgcolor: isMarked ? 'error.main' : 'action.selected',
                          },
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label={isMarked ? 'desmarcar remoção' : 'marcar para remoção'}
                            onClick={event => {
                              event.stopPropagation();
                              handleToggleUserDeletion(user.id);
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={user.name}
                          secondary={user.email}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    );
                  })}
                  {usersToAdd.map((user, index) => (
                    <ListItem
                      key={`new-${index}-${user.email}`}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        bgcolor: 'action.hover',
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label="remover usuário"
                          onClick={() => handleRemoveAddedUser(index)}
                        >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      }
                    >
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
                {isLoadingCompany && (
                  <Typography variant="caption" color="text.secondary">
                    Carregando usuários...
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleDeleteClick} color="error" variant="outlined">
              Excluir
            </Button>
            <IconButton onClick={() => setOpenAddUser(true)}>
              <PersonAddIcon sx={{ color: 'primary.main' }} />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              type="submit"
              disabled={updateMutation.isPending || isLoadingCompany}
            >
              Editar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        itemName={company.name}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />

      <ModalAddUser open={openAddUser} onClose={() => setOpenAddUser(false)} onAdd={handleAddUser} />
    </>
  );
}
