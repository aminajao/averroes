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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Image Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          margin="dense"
          label="Image URL"
          fullWidth
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="https://example.com/image.jpg"
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!name.trim() || !url.trim()}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
