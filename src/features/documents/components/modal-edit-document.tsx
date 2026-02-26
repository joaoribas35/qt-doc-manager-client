import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
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
import { handleToastErrorMsg } from '@/utils/handle-toast-error-msg';

import type { UpdateDocumentInput } from '../api/update-document';
import { useDeleteDocument } from '../hooks/use-delete-document';
import { useUpdateDocument } from '../hooks/use-update-document';
import type { Document } from '../types/document';

const schema = z.object({
  name: z.string().optional(),
  number: z.string().optional(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  remarks: z.string().optional(),
});

export type EditDocumentFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  document: Document | null;
  companySlug?: string;
}

export function EditDocumentModal({ open, setOpen, document, companySlug }: Props) {
  const updateMutation = useUpdateDocument(companySlug);
  const deleteMutation = useDeleteDocument(companySlug);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<EditDocumentFormData>({
    resolver: zodResolver(schema as never),
  });

  useEffect(() => {
    if (document && open) {
      // Format dates from ISO string to YYYY-MM-DD for DatePicker
      // Use UTC mode to avoid timezone shifts when parsing
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = dayjs.utc(dateString);
        return date.format('YYYY-MM-DD');
      };

      setValue('name', document.name);
      setValue('number', document.number);
      setValue('issuer', document.issuer);
      setValue('issueDate', formatDateForInput(document.issueDate));
      setValue('dueDate', formatDateForInput(document.dueDate));
      setValue('remarks', document.remarks);
    }
  }, [document, open, setValue]);

  const onSubmit = async (data: EditDocumentFormData) => {
    if (!document) return;

    const input: UpdateDocumentInput = {
      documentId: document.id,
    };

    if (data.name && data.name.trim()) input.name = data.name;
    if (data.number && data.number.trim()) input.number = data.number;
    if (data.issuer && data.issuer.trim()) input.issuer = data.issuer;
    if (data.issueDate && data.issueDate.trim()) input.issueDate = data.issueDate;
    if (data.dueDate && data.dueDate.trim()) input.dueDate = data.dueDate;
    if (data.remarks !== undefined) input.remarks = data.remarks;

    try {
      await updateMutation.mutateAsync(input);
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

  const handleDeleteClick = () => {
    setOpenDeleteConfirm(true);
  };

  if (!document) return null;

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
        <DialogTitle>Editar Documento</DialogTitle>
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleDeleteClick} color="error" variant="outlined">
            Excluir
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              type="submit"
              disabled={updateMutation.isPending}
            >
              Salvar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        itemName={document.name}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
