import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteNotification } from '../api/delete-notification';

import { getNotificationsKey } from './use-get-notifications';

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteNotification(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getNotificationsKey],
      });
    },
  });
};
