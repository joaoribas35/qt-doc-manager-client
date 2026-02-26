import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { LoadingButton } from '@/components/loading-button';
import { usePasswordRecovery } from '@/hooks/use-auth';
import { router } from '@/lib/tanstack-router';
import { passwordRecoverySchema, type PasswordRecoveryInput } from '@/types/auth.types';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

export const Route = createFileRoute('/recuperar-senha')({
  component: RouteComponent,
});

function RouteComponent() {
  const mutation = usePasswordRecovery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryInput>({
    resolver: zodResolver(passwordRecoverySchema as never),
  });

  const onSubmit = async (data: PasswordRecoveryInput) => {
    try {
      await mutation.mutateAsync(data);
      toast.success('Instruções de recuperação de senha foram enviadas para seu email');
      router.navigate({ to: '/' });
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="img" src={`/static/assets/logo.png`} alt="br_quality" height={60} />
        <Typography component="h1" variant="h5">
          Recuperar Senha
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Digite seu email para receber instruções de recuperação de senha
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <LoadingButton fullWidth isLoading={mutation.isPending} label="Enviar" type="submit" sx={{ mt: 3, mb: 2 }} />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => router.navigate({ to: '/' })}
            sx={{ cursor: 'pointer' }}
          >
            Voltar para o login
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
