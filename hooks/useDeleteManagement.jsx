import { useState } from 'react';
import { ITEM_TYPES } from '@/lib/constants';

export function useDeleteManagement(deletionStrategies) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (type, item) => {
    setItemToDelete({ type, item });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && deletionStrategies[itemToDelete.type]) {
      deletionStrategies[itemToDelete.type](itemToDelete.item);
    }
    closeDeleteDialog();
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return {
    deleteDialogOpen,
    itemToDelete,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
  };
}
