import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { useGetCompaniesSummary } from '../hooks/use-get-companies-summary';
import type { CompaniesSummary } from '../types/companies-summary';

import { CompanyCard } from './company-card';

interface CompaniesListProps {
  onEdit: (company: CompaniesSummary) => void;
}

export function CompaniesList({ onEdit }: CompaniesListProps) {
  const { data, isLoading, isError, isSuccess } = useGetCompaniesSummary();

  if (isLoading)
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={82} sx={{ borderRadius: 2 }} />
        ))}
      </>
    );

  if (isError) return <Typography variant="body1">Erro ao carregar as empresas</Typography>;
  if (!isSuccess) return <Typography variant="body1">Algo errado aconteceu ao carregar as empresas</Typography>;

  return (
    <>
      {data.length > 0 ? (
        data.map(company => <CompanyCard key={company.id} company={company} onEdit={onEdit} />)
      ) : (
        <Typography variant="body1">Nenhuma empresa cadastrada</Typography>
      )}
    </>
  );
}
