'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  alpha,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

export default function ImageGallery({ images, categories, onDelete }) {
  const router = useRouter();

  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
        <Card
          key={image.id}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
              '& .image-overlay': {
                opacity: 1,
              },
            },
          }}
        >
          <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={image.url}
              alt={image.name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/images/${image.id}`)}
            />
            <Box
              className="image-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s',
                pb: 2,
              }}
            >
              <IconButton
                onClick={() => router.push(`/images/${image.id}`)}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  mr: 1,
                }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image);
                }}
                sx={{
                  bgcolor: alpha('#ef4444', 0.9),
                  color: 'white',
                  '&:hover': { bgcolor: '#dc2626' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
            <Typography
              variant="h6"
              gutterBottom
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                mb: 1.5,
              }}
            >
              {image.name}
            </Typography>
            <Chip
              label={getCategoryName(image.categoryId)}
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {formatDate(image.uploadDate)}
            </Typography>
            {image.metadata && Object.keys(image.metadata).length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                  mt: 1,
                  pt: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {Object.entries(image.metadata)
                  .slice(0, 2)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(' • ')}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
