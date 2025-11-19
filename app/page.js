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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: 8,
          pb: 12,
          mb: -6,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
              Image Management System
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}>
              Upload, organize, and annotate your images with professional tools
            </Typography>
          </Box>
        </Container>
      </Box>

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

        {activeTab === 0 && (
          <Box>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  placeholder="Search images by name or metadata..."
                  variant="outlined"
                  size="medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flexGrow: 1,
                    minWidth: 280,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
                <FormControl
                  size="medium"
                  sx={{
                    minWidth: 220,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                >
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
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                  sx={{
                    px: 3,
                    py: 1.5,
                  }}
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
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryDialogOpen(true);
                }}
                sx={{ px: 3, py: 1.5 }}
              >
                Create Category
              </Button>
            </Box>

            {categoriesLoading ? (
              <Typography>Loading categories...</Typography>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gap: 3,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                }}
              >
                {categories?.map((category) => (
                  <Paper
                    key={category.id}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(102, 126, 234, 0.15)',
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                      {category.description || 'No description provided'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        size="medium"
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="medium"
                        variant="outlined"
                        color="error"
                        fullWidth
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
