import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleToastErrorMsg = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.code && error.response?.data?.message) {
      const errorCode = error.response.data.code;
      const errorMessage = error.response.data.message;
      toast.error(`${errorCode}: ${errorMessage}`);

      return;
    }
  }

  if (error instanceof Error) {
    toast.error(`APP-002: ${error.message}`);
    return;
  }

  const errorObject = JSON.stringify(error);

  if (errorObject) {
    toast.error(`APP-003: ${errorObject}`);
    return;
  }

  toast.error('APP-001: Ocorreu um erro inesperado');
  return;
};
