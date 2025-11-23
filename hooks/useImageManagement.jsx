import { useState } from 'react';
import { useCreateImage, useDeleteImage } from './useImages';
import { useMutationWithNotification } from './useMutationWithNotification';
import { MESSAGES } from '@/lib/constants';
import { imagesAPI } from '@/lib/api';

export function useImageManagement(showSuccess, showError) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const createImageMutation = useMutationWithNotification({
    mutationFn: imagesAPI.create,
    queryKey: 'images',
    successMessage: MESSAGES.IMAGE_UPLOADED,
    errorMessage: MESSAGES.UPLOAD_FAILED,
    onSuccessCallback: showSuccess,
    onErrorCallback: showError,
  });

  const deleteImageMutation = useMutationWithNotification({
    mutationFn: imagesAPI.delete,
    queryKey: 'images',
    successMessage: MESSAGES.IMAGE_DELETED,
    errorMessage: MESSAGES.DELETE_FAILED,
    onSuccessCallback: showSuccess,
    onErrorCallback: showError,
  });

  const handleUploadImage = (imageData) => {
    createImageMutation.mutate(imageData, {
      onSuccess: () => setUploadDialogOpen(false),
    });
  };

  const handleDeleteImage = (image) => {
    setSelectedImage(image);
    return image;
  };

  const confirmDeleteImage = () => {
    if (selectedImage) {
      deleteImageMutation.mutate(selectedImage.id);
      setSelectedImage(null);
    }
  };

  const openUploadDialog = () => setUploadDialogOpen(true);
  const closeUploadDialog = () => setUploadDialogOpen(false);

  return {
    uploadDialogOpen,
    openUploadDialog,
    closeUploadDialog,
    handleUploadImage,
    handleDeleteImage,
    confirmDeleteImage,
    selectedImage,
    setSelectedImage,
    isUploading: createImageMutation.isPending,
    isDeleting: deleteImageMutation.isPending,
  };
}
