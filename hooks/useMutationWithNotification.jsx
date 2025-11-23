import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMutationWithNotification({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onSuccessCallback,
  onErrorCallback,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      if (onSuccessCallback) {
        onSuccessCallback(successMessage);
      }
    },
    onError: (error) => {
      if (onErrorCallback) {
        const message = errorMessage ? `${errorMessage}: ${error.message}` : error.message;
        onErrorCallback(message);
      }
    },
  });
}
