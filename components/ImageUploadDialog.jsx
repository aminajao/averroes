'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useCategories } from '@/hooks/useCategories';

export default function ImageUploadDialog({ open, onClose, onUpload }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [metadata, setMetadata] = useState('');
  const { data: categories } = useCategories();

  const handleUpload = () => {
    const imageData = {
      name,
      url,
      categoryId,
      uploadDate: new Date().toISOString(),
      metadata: metadata ? JSON.parse(metadata) : {},
    };
    onUpload(imageData);
    setName('');
    setUrl('');
    setCategoryId('');
    setMetadata('');
  };

  const handleClose = () => {
    setName('');
    setUrl('');
    setCategoryId('');
    setMetadata('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, fontSize: '1.5rem', fontWeight: 700 }}>
        Upload New Image
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Image Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2.5 }}
        />
        <TextField
          margin="dense"
          label="Image URL"
          fullWidth
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2.5 }}
          placeholder="https://example.com/image.jpg"
        />
        <FormControl fullWidth sx={{ mb: 2.5 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryId}
            label="Category"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Metadata (JSON)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder='{"size": "1920x1080", "resolution": "72dpi"}'
          helperText="Optional: Add custom metadata in JSON format"
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} size="large" sx={{ px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          size="large"
          disabled={!name.trim() || !url.trim()}
          sx={{ px: 3 }}
        >
          Upload Image
        </Button>
      </DialogActions>
    </Dialog>
  );
}
