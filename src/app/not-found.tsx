import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div>
      <p>This is the notFoundComponent configured on root route</p>
      <Link to="/empresas">Start Over</Link>
    </div>
  );
}
