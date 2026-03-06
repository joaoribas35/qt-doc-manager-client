import { DocumentFormModal } from './modal-document-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  companySlug: string;
}

export function CreateDocumentModal({ open, setOpen, companySlug }: Props) {
  return <DocumentFormModal open={open} setOpen={setOpen} companySlug={companySlug} document={null} />;
}
