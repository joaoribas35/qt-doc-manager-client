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
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

dayjs.extend(utc);
dayjs.locale('pt-br');

import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { useGetCompaniesSummary } from '@/features/companies/hooks/use-get-companies-summary';
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import { useCreateDocument } from '../hooks/use-create-document';
import { useDeleteDocument } from '../hooks/use-delete-document';
import { useUpdateDocument } from '../hooks/use-update-document';
import type { Document } from '../types/document';

const schema = z.object({
  name: z.string().min(1, { message: 'campo obrigatório' }),
  number: z.string().optional(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  remarks: z.string().optional(),
  file: z
    .instanceof(File)
    .refine(file => file.size > 0, { message: 'arquivo inválido' })
    .refine(file => file.size <= 10 * 1024 * 1024, { message: 'tamanho máximo do arquivo é 10 MB' })
    .optional(),
});

export type DocumentFormData = z.infer<typeof schema>;

interface BaseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  companySlug: string;
}

interface CreateProps extends BaseProps {
  document?: null;
}

interface EditProps extends BaseProps {
  document: Document;
}

type Props = CreateProps | EditProps;

export function DocumentFormModal({ open, setOpen, companySlug, document }: Props) {
  const isEdit = document != null;
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument(companySlug);
  const deleteMutation = useDeleteDocument(companySlug);
  const { data: companies } = useGetCompaniesSummary();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      name: '',
      number: '',
      issuer: '',
      issueDate: '',
      dueDate: '',
      remarks: '',
    },
  });

  const fileWatch = watch('file');

  useEffect(() => {
    if (open && document) {
      const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return '';
        return dayjs.utc(dateString).format('YYYY-MM-DD');
      };
      reset({
        name: document.name,
        number: document.number ?? '',
        issuer: document.issuer ?? '',
        issueDate: formatDateForInput(document.issueDate),
        dueDate: formatDateForInput(document.dueDate),
        remarks: document.remarks ?? '',
      });
    }
    if (open && !document) {
      reset({
        name: '',
        number: '',
        issuer: '',
        issueDate: '',
        dueDate: '',
        remarks: '',
      });
    }
  }, [open, document, reset]);

  const onSubmit = async (data: DocumentFormData) => {
    if (isEdit && document) {
      const input = {
        documentId: document.id,
        name: data.name,
        number: data.number,
        issuer: data.issuer,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        remarks: data.remarks ?? '',
        ...(data.file && { file: data.file }),
      };
      try {
        await updateMutation.mutateAsync(input);
        handleClose();
      } catch (error) {
        handleToastErrorMsg(error);
      }
      return;
    }

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
      ...(data.file && { file: data.file }),
    };

    try {
      await createMutation.mutateAsync(input);
      handleClose();
    } catch (error) {
      handleToastErrorMsg(error);
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    try {
      await deleteMutation.mutateAsync(document.id);
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
  };

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending;

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
        <DialogTitle>{isEdit ? 'Editar Documento' : 'Adicionar Documento'}</DialogTitle>
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
                    {fileWatch && fileWatch instanceof File
                      ? fileWatch.name
                      : isEdit
                        ? 'Substituir Arquivo'
                        : 'Selecionar Arquivo'}
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
        <DialogActions
          sx={{
            ...(isEdit && { justifyContent: 'space-between', px: 3, pb: 2 }),
          }}
        >
          {isEdit && document ? (
            <Button onClick={() => setOpenDeleteConfirm(true)} color="error" variant="outlined">
              Excluir
            </Button>
          ) : (
            <div />
          )}
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained" type="submit" disabled={isPending}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {isEdit && document && (
        <ConfirmDeleteDialog
          open={openDeleteConfirm}
          onClose={() => setOpenDeleteConfirm(false)}
          itemName={document.name}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
