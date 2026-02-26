import { apiClient } from '@/lib/http-client';

import type { Notification } from '../types/notification';

export const getNotifications = () => {
  return apiClient.get<Notification[]>(`/v1/notifications`);
};
