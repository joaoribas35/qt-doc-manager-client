import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import LoadingSpinner from '@/components/loading-spinner';
import { useLogin } from '@/hooks/use-auth';
import { router } from '@/lib/tanstack-router';
import { useUserStore } from '@/store/user.store';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (isAuthenticated) {
      throw redirect({
        to: '/empresas',
      });
    }
  },
  component: LoginPage,
  pendingComponent: () => <LoadingSpinner open={true} />,
});

const loginSchema = z.object({
  email: z.email('Endereço de email inválido'),
  password: z.string().min(4, 'A senha deve conter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const mutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as never),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutation.mutateAsync(data);

      router.navigate({ to: '/empresas' });
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="img" src={`/static/assets/logo.png`} alt="br_quality" height={60} />
        <Typography component="h1" variant="h5">
          Gestão de Documentos
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="email"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          label="senha"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => router.navigate({ to: '/recuperar-senha' })}
            sx={{ cursor: 'pointer' }}
          >
            Esqueceu sua senha?
          </Link>
        </Box>

        <LoadingButton fullWidth isLoading={mutation.isPending} label="Acessar" type="submit" sx={{ mt: 3, mb: 2 }} />
      </Box>
    </Container>
  );
}
