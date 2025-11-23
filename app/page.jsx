'use client';

import { useState } from 'react';
import { Container, Box, Paper, Tabs, Tab, Alert, Snackbar } from '@mui/material';
import { Image as ImageIcon, Category as CategoryIcon } from '@mui/icons-material';
import { useImages } from '@/hooks/useImages';
import { useCategories } from '@/hooks/useCategories';
import { useNotifications } from '@/hooks/useNotifications';
import { useImageManagement } from '@/hooks/useImageManagement';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { useDeleteManagement } from '@/hooks/useDeleteManagement';
import PageHeader from '@/components/PageHeader';
import ImagesTab from '@/components/ImagesTab';
import CategoriesTab from '@/components/CategoriesTab';
import ImageUploadDialog from '@/components/ImageUploadDialog';
import CategoryDialog from '@/components/CategoryDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import { TABS, ITEM_TYPES } from '@/lib/constants';

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS.IMAGES);

  const { data: images, isLoading: imagesLoading } = useImages();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { snackbar, showSuccess, showError, hideNotification } = useNotifications();

  const imageManagement = useImageManagement(showSuccess, showError);
  const categoryManagement = useCategoryManagement(showSuccess, showError);

  const deletionStrategies = {
    [ITEM_TYPES.IMAGE]: () => imageManagement.confirmDeleteImage(),
    [ITEM_TYPES.CATEGORY]: () => categoryManagement.confirmDeleteCategory(),
  };

  const deleteManagement = useDeleteManagement(deletionStrategies);

  const handleImageDelete = (image) => {
    imageManagement.handleDeleteImage(image);
    deleteManagement.handleDelete(ITEM_TYPES.IMAGE, image);
  };

  const handleCategoryDelete = (category) => {
    categoryManagement.handleDeleteCategory(category);
    deleteManagement.handleDelete(ITEM_TYPES.CATEGORY, category);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader />

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2.5,
                fontSize: '1rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab icon={<ImageIcon />} label="Images" iconPosition="start" />
            <Tab icon={<CategoryIcon />} label="Categories" iconPosition="start" />
          </Tabs>
        </Paper>

        {activeTab === TABS.IMAGES && (
          <ImagesTab
            images={images}
            categories={categories}
            isLoading={imagesLoading}
            onDelete={handleImageDelete}
            onOpenUpload={imageManagement.openUploadDialog}
          />
        )}

        {activeTab === TABS.CATEGORIES && (
          <CategoriesTab
            categories={categories}
            isLoading={categoriesLoading}
            onEdit={categoryManagement.handleEditCategory}
            onDelete={handleCategoryDelete}
            onOpenCreate={categoryManagement.openCategoryDialog}
          />
        )}

        <ImageUploadDialog
          open={imageManagement.uploadDialogOpen}
          onClose={imageManagement.closeUploadDialog}
          onUpload={imageManagement.handleUploadImage}
        />

        <CategoryDialog
          open={categoryManagement.categoryDialogOpen}
          onClose={categoryManagement.closeCategoryDialog}
          onSave={categoryManagement.handleSaveCategory}
          category={categoryManagement.editingCategory}
        />

        <ConfirmDialog
          open={deleteManagement.deleteDialogOpen}
          onClose={deleteManagement.closeDeleteDialog}
          onConfirm={deleteManagement.confirmDelete}
          title={`Delete ${deleteManagement.itemToDelete?.type}`}
          message={`Are you sure you want to delete this ${deleteManagement.itemToDelete?.type}? This action cannot be undone.`}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={hideNotification}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
