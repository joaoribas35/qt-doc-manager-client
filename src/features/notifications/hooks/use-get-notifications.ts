import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getNotifications } from '../api/get-notifications';
import type { Notification } from '../types/notification';

export const getNotificationsKey = 'getNotificationsKey';

export const useGetNotifications = (): UseQueryResult<Notification[], Error> => {
  return useQuery<Notification[]>({
    queryKey: [getNotificationsKey],
    queryFn: () => getNotifications(),
  });
};
