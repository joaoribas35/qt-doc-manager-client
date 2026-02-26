import { apiClient } from '@/lib/http-client';

export const deleteNotification = (messageId: string) => {
  return apiClient.delete(`/v1/notifications/${messageId}`);
};
