'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useImage } from '@/hooks/useImages';
import { useCategories } from '@/hooks/useCategories';
import { useImageAnnotations, useCreateAnnotation } from '@/hooks/useAnnotations';
import ImageAnnotator from '@/components/ImageAnnotator';

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const imageId = params.id;

  const { data: image, isLoading: imageLoading } = useImage(imageId);
  const { data: categories } = useCategories();
  const { data: annotations = [], isLoading: annotationsLoading } = useImageAnnotations(imageId);
  const createAnnotationMutation = useCreateAnnotation();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [localAnnotations, setLocalAnnotations] = useState([]);

  useEffect(() => {
    if (annotations) {
      setLocalAnnotations(annotations);
    }
  }, [annotations]);

  const getCategoryName = (categoryId) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveAnnotations = (newAnnotations) => {
    newAnnotations.forEach((annotation) => {
      if (!annotation.savedToAPI) {
        createAnnotationMutation.mutate(
          {
            imageId: parseInt(imageId),
            ...annotation,
          },
          {
            onSuccess: () => {
              setSnackbar({
                open: true,
                message: 'Annotations saved successfully',
                severity: 'success',
              });
            },
            onError: () => {
              setSnackbar({
                open: true,
                message: 'Note: API is read-only. Annotations are stored locally.',
                severity: 'info',
              });
            },
          }
        );
      }
    });

    setLocalAnnotations(newAnnotations.map((a) => ({ ...a, savedToAPI: true })));
  };

  if (imageLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!image) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Image not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.push('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {image.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uploaded on {formatDate(image.uploadDate)}
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Image Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Category
              </Typography>
              <Chip label={getCategoryName(image.categoryId)} color="primary" size="small" />
            </Box>
            {image.metadata && Object.keys(image.metadata).length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Metadata
                </Typography>
                {Object.entries(image.metadata).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {value}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Image Annotation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Draw rectangles on the image to annotate specific regions
          </Typography>
          {annotationsLoading ? (
            <CircularProgress />
          ) : (
            <ImageAnnotator
              imageSrc={image.url}
              annotations={localAnnotations}
              onSaveAnnotations={handleSaveAnnotations}
            />
          )}
        </Paper>

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
