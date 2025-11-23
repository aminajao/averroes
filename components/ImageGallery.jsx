'use client';

import { Box, Typography } from '@mui/material';
import ImageCard from './ImageCard';

export default function ImageGallery({ images, categories, onDelete }) {
  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 12,
          px: 3,
        }}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No images found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first image to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(5, 1fr)',
        },
        gap: 3,
      }}
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          categories={categories}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
