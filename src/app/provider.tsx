import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import theme from '@/config/theme';
import { queryClient } from '@/lib/tanstack-query';
import 'dayjs/locale/pt-br';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          {children}
        </LocalizationProvider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
