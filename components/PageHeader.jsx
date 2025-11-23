'use client';

import { Box, Container, Typography } from '@mui/material';
import { GRADIENTS } from '@/lib/constants';

export default function PageHeader() {
  return (
    <Box
      sx={{
        background: GRADIENTS.PRIMARY,
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
  );
}
