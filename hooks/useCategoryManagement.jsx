import { useState } from 'react';
import { useMutationWithNotification } from './useMutationWithNotification';
import { MESSAGES } from '@/lib/constants';
import { categoriesAPI } from '@/lib/api';

export function useCategoryManagement(showSuccess, showError) {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const createCategoryMutation = useMutationWithNotification({
    mutationFn: categoriesAPI.create,
    queryKey: 'categories',
    successMessage: MESSAGES.CATEGORY_CREATED,
    errorMessage: MESSAGES.CREATE_FAILED,
    onSuccessCallback: showSuccess,
    onErrorCallback: showError,
  });

  const updateCategoryMutation = useMutationWithNotification({
    mutationFn: ({ id, data }) => categoriesAPI.update(id, data),
    queryKey: 'categories',
    successMessage: MESSAGES.CATEGORY_UPDATED,
    errorMessage: MESSAGES.UPDATE_FAILED,
    onSuccessCallback: showSuccess,
    onErrorCallback: showError,
  });

  const deleteCategoryMutation = useMutationWithNotification({
    mutationFn: categoriesAPI.delete,
    queryKey: 'categories',
    successMessage: MESSAGES.CATEGORY_DELETED,
    errorMessage: MESSAGES.DELETE_FAILED,
    onSuccessCallback: showSuccess,
    onErrorCallback: showError,
  });

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate(
        { id: editingCategory.id, data: categoryData },
        {
          onSuccess: () => {
            setCategoryDialogOpen(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      createCategoryMutation.mutate(categoryData, {
        onSuccess: () => setCategoryDialogOpen(false),
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    return category;
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
      setSelectedCategory(null);
    }
  };

  const openCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const closeCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  return {
    categoryDialogOpen,
    editingCategory,
    selectedCategory,
    setSelectedCategory,
    openCategoryDialog,
    closeCategoryDialog,
    handleSaveCategory,
    handleEditCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
