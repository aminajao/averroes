'use client';

import { Box, Button, Paper, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function CategoriesTab({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
}) {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onOpenCreate}
          sx={{ px: 3, py: 1.5 }}
        >
          Create Category
        </Button>
      </Box>

      {isLoading ? (
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
                  onClick={() => onEdit(category)}
                >
                  Edit
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => onDelete(category)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
