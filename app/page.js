'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useImages, useDeleteImage, useCreateImage } from '@/hooks/useImages';
import { useCategories, useDeleteCategory, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import ImageGallery from '@/components/ImageGallery';
import ImageUploadDialog from '@/components/ImageUploadDialog';
import CategoryDialog from '@/components/CategoryDialog';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: images, isLoading: imagesLoading } = useImages();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const deleteImageMutation = useDeleteImage();
  const createImageMutation = useCreateImage();
  const deleteCategoryMutation = useDeleteCategory();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const filteredImages = useMemo(() => {
    if (!images) return [];

    return images.filter((image) => {
      const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (image.metadata && JSON.stringify(image.metadata).toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !categoryFilter || image.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [images, searchQuery, categoryFilter]);

  const handleUploadImage = (imageData) => {
    createImageMutation.mutate(imageData, {
      onSuccess: () => {
        setUploadDialogOpen(false);
        showSnackbar('Image uploaded successfully', 'success');
      },
      onError: () => {
        showSnackbar('Note: API is read-only. Changes are simulated.', 'info');
        setUploadDialogOpen(false);
      },
    });
  };

  const handleDeleteImage = (image) => {
    setItemToDelete({ type: 'image', item: image });
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setItemToDelete({ type: 'category', item: category });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete.type === 'image') {
      deleteImageMutation.mutate(itemToDelete.item.id, {
        onSuccess: () => showSnackbar('Image deleted successfully', 'success'),
        onError: () => showSnackbar('Note: API is read-only. Changes are simulated.', 'info'),
      });
    } else {
      deleteCategoryMutation.mutate(itemToDelete.item.id, {
        onSuccess: () => showSnackbar('Category deleted successfully', 'success'),
        onError: () => showSnackbar('Note: API is read-only. Changes are simulated.', 'info'),
      });
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate(
        { id: editingCategory.id, data: categoryData },
        {
          onSuccess: () => {
            showSnackbar('Category updated successfully', 'success');
            setCategoryDialogOpen(false);
            setEditingCategory(null);
          },
          onError: () => {
            showSnackbar('Note: API is read-only. Changes are simulated.', 'info');
            setCategoryDialogOpen(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      createCategoryMutation.mutate(categoryData, {
        onSuccess: () => {
          showSnackbar('Category created successfully', 'success');
          setCategoryDialogOpen(false);
        },
        onError: () => {
          showSnackbar('Note: API is read-only. Changes are simulated.', 'info');
          setCategoryDialogOpen(false);
        },
      });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Image Management System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload, organize, and annotate your images with ease
          </Typography>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab icon={<ImageIcon />} label="Images" />
            <Tab icon={<CategoryIcon />} label="Categories" />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search images..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flexGrow: 1, minWidth: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Filter by Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories?.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Upload Image
                </Button>
              </Box>
            </Paper>

            {imagesLoading ? (
              <Typography>Loading images...</Typography>
            ) : (
              <ImageGallery
                images={filteredImages}
                categories={categories}
                onDelete={handleDeleteImage}
              />
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryDialogOpen(true);
                }}
              >
                Create Category
              </Button>
            </Box>

            {categoriesLoading ? (
              <Typography>Loading categories...</Typography>
            ) : (
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {categories?.map((category) => (
                  <Paper key={category.id} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        <ImageUploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleUploadImage}
        />

        <CategoryDialog
          open={categoryDialogOpen}
          onClose={() => {
            setCategoryDialogOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          category={editingCategory}
        />

        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title={`Delete ${itemToDelete?.type}`}
          message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
