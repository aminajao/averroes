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
import { formatDate, getCategoryName } from '@/lib/utils';
import { GRADIENTS } from '@/lib/constants';

export default function ImageCard({ image, categories, onDelete }) {
  const router = useRouter();

  const handleViewImage = () => {
    router.push(`/images/${image.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(image);
  };

  return (
    <Card
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
          onClick={handleViewImage}
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
            onClick={handleViewImage}
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
            onClick={handleDelete}
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
          label={getCategoryName(categories, image.categoryId)}
          size="small"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            background: GRADIENTS.PRIMARY,
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
  );
}
