import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { annotationsAPI } from '@/lib/api';

export function useAnnotations() {
  return useQuery({
    queryKey: ['annotations'],
    queryFn: annotationsAPI.getAll,
  });
}

export function useImageAnnotations(imageId) {
  return useQuery({
    queryKey: ['annotations', 'image', imageId],
    queryFn: () => annotationsAPI.getByImageId(imageId),
    enabled: !!imageId,
  });
}

export function useCreateAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: annotationsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}

export function useUpdateAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => annotationsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}

export function useDeleteAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: annotationsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations'] });
    },
  });
}
