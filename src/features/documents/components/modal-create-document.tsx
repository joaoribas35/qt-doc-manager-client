import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

dayjs.locale('pt-br');

import { useGetCompaniesSummary } from '@/features/companies/hooks/use-get-companies-summary';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import { useCreateDocument } from '../hooks/use-create-document';

const schema = z.object({
  name: z.string().min(1, { message: 'campo obrigatório' }),
  number: z.string().min(1, { message: 'campo obrigatório' }),
  issuer: z.string().min(1, { message: 'campo obrigatório' }),
  issueDate: z.string().min(1, { message: 'campo obrigatório' }),
  dueDate: z.string().min(1, { message: 'campo obrigatório' }),
  remarks: z.string().optional(),
  file: z
    .instanceof(File, { message: 'arquivo obrigatório' })
    .refine(file => file.size > 0, { message: 'arquivo obrigatório' }),
});

export type CreateDocumentFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  companySlug: string;
}

export function CreateDocumentModal({ open, setOpen, companySlug }: Props) {
  const mutation = useCreateDocument();
  const { data: companies } = useGetCompaniesSummary();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(schema as never),
  });

  const fileWatch = watch('file');

  const onSubmit = async (data: CreateDocumentFormData) => {
    const company = companies?.find(c => c.slug === companySlug);

    if (!company) {
      handleToastErrorMsg(new Error('Empresa não encontrada'));
      return;
    }

    const input = {
      name: data.name,
      number: data.number,
      issuer: data.issuer,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      remarks: data.remarks || '',
      companyId: company.id,
      companySlug: companySlug,
      file: data.file,
    };

    try {
      await mutation.mutateAsync(input);
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
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
      <DialogTitle>Adicionar Documento</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Nome"
            {...register('name')}
            fullWidth
            error={!!errors['name']}
            helperText={errors['name'] ? errors['name'].message : ''}
          />
          <TextField
            label="Número"
            {...register('number')}
            fullWidth
            error={!!errors['number']}
            helperText={errors['number'] ? errors['number'].message : ''}
          />
          <TextField
            label="Órgão Emissor"
            {...register('issuer')}
            fullWidth
            error={!!errors['issuer']}
            helperText={errors['issuer'] ? errors['issuer'].message : ''}
          />
          <Controller
            name="issueDate"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <DatePicker
                {...field}
                label="Data de Emissão"
                value={value ? dayjs(value) : null}
                onChange={date => {
                  onChange(date ? date.format('YYYY-MM-DD') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors['issueDate'],
                    helperText: errors['issueDate'] ? errors['issueDate'].message : '',
                  },
                }}
              />
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <DatePicker
                {...field}
                label="Data de Vencimento"
                value={value ? dayjs(value) : null}
                onChange={date => {
                  onChange(date ? date.format('YYYY-MM-DD') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors['dueDate'],
                    helperText: errors['dueDate'] ? errors['dueDate'].message : '',
                  },
                }}
              />
            )}
          />
          <TextField
            label="Observações"
            multiline
            rows={3}
            {...register('remarks')}
            fullWidth
            error={!!errors['remarks']}
            helperText={errors['remarks'] ? errors['remarks'].message : ''}
          />
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    p: 1.5,
                    textTransform: 'none',
                    ...(errors['file'] && {
                      backgroundColor: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                    }),
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="application/pdf,image/*"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                  />
                  {fileWatch && fileWatch instanceof File ? fileWatch.name : 'Selecionar Arquivo'}
                </Button>
                {errors['file'] && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1.5 }}>
                    {errors['file'].message}
                  </Typography>
                )}
              </>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" type="submit">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
