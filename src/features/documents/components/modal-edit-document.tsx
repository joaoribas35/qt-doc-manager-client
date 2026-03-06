import type { Document } from '../types/document';

import { DocumentFormModal } from './modal-document-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  document: Document | null;
  companySlug?: string;
}

export function EditDocumentModal({ open, setOpen, document, companySlug }: Props) {
  if (!document || !companySlug) return null;

  return <DocumentFormModal open={open} setOpen={setOpen} companySlug={companySlug} document={document} />;
}
