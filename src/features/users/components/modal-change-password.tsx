import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import { useUpdatePassword } from '../hooks/use-update-password';

const schema = z
  .object({
    currentPassword: z.string().min(1, { message: 'campo obrigatório' }),
    newPassword: z.string().min(6, { message: 'mínimo 6 caracteres' }),
    confirmPassword: z.string().min(1, { message: 'campo obrigatório' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'as senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ModalChangePassword({ open, onClose }: Props) {
  const updatePasswordMutation = useUpdatePassword();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema as never),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Senha alterada com sucesso');
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
      <DialogTitle>Alterar senha</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }} component="form" id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Senha atual"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword')}
            fullWidth
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <LoadingButton
          type="submit"
          form="change-password-form"
          label="Alterar senha"
          isLoading={updatePasswordMutation.isPending}
        />
      </DialogActions>
    </Dialog>
  );
}
