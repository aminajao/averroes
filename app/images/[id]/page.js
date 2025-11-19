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

  const handleSaveAnnotations = async (newAnnotations) => {
    const persistedIds = new Set(annotations.map(a => String(a.id)));
    const annotationsToSave = newAnnotations.filter(a => {
      const hasPersistedId = a.id && String(a.id).includes('_');
      return !hasPersistedId || !persistedIds.has(String(a.id));
    });

    if (annotationsToSave.length === 0) {
      setSnackbar({
        open: true,
        message: 'No new annotations to save',
        severity: 'info',
      });
      return;
    }

    let savedCount = 0;
    let errorCount = 0;

    for (const annotation of annotationsToSave) {
      try {
        await createAnnotationMutation.mutateAsync({
          imageId: imageId,
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height,
          color: annotation.color,
          label: annotation.label || '',
        });
        savedCount++;
      } catch (error) {
        console.error('Error saving annotation:', error);
        errorCount++;
      }
    }

    if (savedCount > 0) {
      setSnackbar({
        open: true,
        message: `Successfully saved ${savedCount} annotation${savedCount !== 1 ? 's' : ''}`,
        severity: 'success',
      });
    } else if (errorCount > 0) {
      setSnackbar({
        open: true,
        message: 'Failed to save annotations',
        severity: 'error',
      });
    }
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: 6,
          pb: 8,
          mb: -4,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
              Back to Gallery
            </Typography>
          </Box>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
              {image.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Uploaded on {formatDate(image.uploadDate)}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
            Image Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                Category
              </Typography>
              <Chip
                label={getCategoryName(image.categoryId)}
                size="medium"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              />
            </Box>
            {image.metadata && Object.keys(image.metadata).length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
                  Metadata
                </Typography>
                {Object.entries(image.metadata).map(([key, value]) => (
                  <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                    <strong>{key}:</strong> {value}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Paper>

        <Box>
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
            Image Annotation
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
        </Box>

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
