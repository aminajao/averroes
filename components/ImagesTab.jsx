'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Pagination,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import ImageGallery from './ImageGallery';
import { filterImages } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import { PAGINATION, GRADIENTS } from '@/lib/constants';

export default function ImagesTab({
  images,
  categories,
  isLoading,
  onDelete,
  onOpenUpload,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredImages = useMemo(() => {
    return filterImages(images, { searchQuery, categoryFilter });
  }, [images, searchQuery, categoryFilter]);

  const {
    page,
    paginatedItems: paginatedImages,
    totalPages,
    handlePageChange,
    resetPage,
  } = usePagination(filteredImages, PAGINATION.IMAGES_PER_PAGE);

  useEffect(() => {
    resetPage();
  }, [searchQuery, categoryFilter, resetPage]);

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: GRADIENTS.LIGHT,
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
            onClick={onOpenUpload}
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Upload Image
          </Button>
        </Box>
      </Paper>

      {isLoading ? (
        <Typography>Loading images...</Typography>
      ) : (
        <>
          <ImageGallery
            images={paginatedImages}
            categories={categories}
            onDelete={onDelete}
          />
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
