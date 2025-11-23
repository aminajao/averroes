import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imagesAPI } from '@/lib/api';

export function useImages() {
  return useQuery({
    queryKey: ['images'],
    queryFn: imagesAPI.getAll,
  });
}

export function useImage(id) {
  return useQuery({
    queryKey: ['images', id],
    queryFn: () => imagesAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imagesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => imagesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imagesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}
