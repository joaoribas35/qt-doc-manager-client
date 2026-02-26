import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { useGetCompanyDocuments } from '../hooks/use-get-company-documents';

import { DocumentCard } from './document-card';

interface DocumentsListProps {
  companySlug: string;
}

export function DocumentsList({ companySlug }: DocumentsListProps) {
  const { data, isLoading, isError, isSuccess } = useGetCompanyDocuments(companySlug);

  if (isLoading)
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
        ))}
      </>
    );

  if (isError) return <Typography variant="body1">Erro ao carregar os documentos</Typography>;
  if (!isSuccess) return <Typography variant="body1">Algo errado aconteceu ao carregar os documentos</Typography>;

  return (
    <>
      {data.length > 0 ? (
        data.map(document => <DocumentCard key={document.id} document={document} companySlug={companySlug} />)
      ) : (
        <Typography variant="body1">Nenhum documento encontrado</Typography>
      )}
    </>
  );
}
