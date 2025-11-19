'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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

  return (
    <Grid container spacing={3}>
      {images?.map((image) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={image.name}
              sx={{
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/images/${image.id}`)}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom noWrap>
                {image.name}
              </Typography>
              <Chip
                label={getCategoryName(image.categoryId)}
                size="small"
                color="primary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(image.uploadDate)}
              </Typography>
              {image.metadata && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  {Object.entries(image.metadata)
                    .slice(0, 2)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' • ')}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                color="primary"
                onClick={() => router.push(`/images/${image.id}`)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(image)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
