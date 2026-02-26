import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Endereço de email inválido'),
  password: z.string().min(4, 'A senha deve conter pelo menos 6 caracteres'),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

export type LoginResponse = {
  id: string;
  email: string;
  name: string;
};

export const passwordRecoverySchema = z.object({
  email: z.email('Endereço de email inválido'),
});

export type PasswordRecoveryInput = z.infer<typeof passwordRecoverySchema>;
