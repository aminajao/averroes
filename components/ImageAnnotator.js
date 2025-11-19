'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import useImage from 'use-image';

function ImageLayer({ src, onImageLoad }) {
  const [image] = useImage(src);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (image && !hasLoaded.current) {
      hasLoaded.current = true;
      onImageLoad(image);
    }
  }, [image]);

  return image ? <KonvaImage image={image} /> : null;
}

export default function ImageAnnotator({ imageSrc, annotations = [], onSaveAnnotations }) {
  const [rectangles, setRectangles] = useState(annotations);
  const [newRect, setNewRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const stageRef = useRef(null);

  const handleImageLoad = (image) => {
    const maxWidth = 800;
    const maxHeight = 600;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    setDimensions({
      width: image.width * ratio,
      height: image.height * ratio,
    });
  };

  const handleMouseDown = (e) => {
    if (e.target !== e.target.getStage()) return;

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      color: selectedColor,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = e.target.getStage().getPointerPosition();
    setNewRect((prev) => ({
      ...prev,
      width: pos.x - prev.x,
      height: pos.y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (newRect && Math.abs(newRect.width) > 5 && Math.abs(newRect.height) > 5) {
      setRectangles([...rectangles, { ...newRect, id: Date.now() }]);
    }
    setNewRect(null);
  };

  const handleSave = () => {
    onSaveAnnotations(rectangles);
  };

  const handleDeleteLast = () => {
    setRectangles(rectangles.slice(0, -1));
  };

  const colors = [
    { hex: '#ef4444', name: 'Red' },
    { hex: '#10b981', name: 'Green' },
    { hex: '#3b82f6', name: 'Blue' },
    { hex: '#f59e0b', name: 'Orange' },
    { hex: '#8b5cf6', name: 'Purple' },
    { hex: '#06b6d4', name: 'Cyan' },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Annotation Tools
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="body2" fontWeight={500}>Color Palette:</Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {colors.map((color) => (
              <Box
                key={color.hex}
                onClick={() => setSelectedColor(color.hex)}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: color.hex,
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: selectedColor === color.hex ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                  boxShadow: selectedColor === color.hex ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  },
                }}
                title={color.name}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleDeleteLast}
            disabled={rectangles.length === 0}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Delete Last
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            Save Annotations
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          display: 'inline-block',
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            <ImageLayer src={imageSrc} onImageLoad={handleImageLoad} />
            {rectangles.map((rect) => (
              <Rect
                key={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                stroke={rect.color}
                strokeWidth={3}
              />
            ))}
            {newRect && (
              <Rect
                x={newRect.x}
                y={newRect.y}
                width={newRect.width}
                height={newRect.height}
                stroke={newRect.color}
                strokeWidth={3}
              />
            )}
          </Layer>
        </Stage>
      </Paper>
    </Box>
  );
}
