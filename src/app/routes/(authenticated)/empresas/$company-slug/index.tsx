import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(authenticated)/empresas/$company-slug/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { 'company-slug': companySlug } = Route.useParams();

  return (
    <div>
      <h1>Company: {companySlug}</h1>
      {/* Your company details component */}
    </div>
  );
}
