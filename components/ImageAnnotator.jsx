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
import { ANNOTATION_COLORS, GRADIENTS } from '@/lib/constants';

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
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const stageRef = useRef(null);

  useEffect(() => {
    setRectangles(annotations);
  }, [annotations]);

  const handleImageLoad = (image) => {
    const maxWidth = window.innerWidth > 1200 ? 1000 : 800;
    const maxHeight = 600;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    setDimensions({
      width: image.width * ratio,
      height: image.height * ratio,
    });
  };

  const handleMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.getClassName() === 'Image';
    if (!clickedOnEmpty) return;

    setIsDrawing(true);
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
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

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
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
      const newAnnotation = { ...newRect, id: Date.now() };
      setRectangles((prev) => [...prev, newAnnotation]);
    }
    setNewRect(null);
  };

  const handleSave = () => {
    onSaveAnnotations(rectangles);
  };

  const handleDeleteLast = () => {
    setRectangles(rectangles.slice(0, -1));
  };


  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: GRADIENTS.PRIMARY,
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Annotation Tools
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          Click and drag on the image below to draw rectangles. {rectangles.length} annotation{rectangles.length !== 1 ? 's' : ''} created.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="body2" fontWeight={500}>Color Palette:</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {ANNOTATION_COLORS.map((color) => (
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  },
                }}
                title={color.name}
              >
                {selectedColor === color.hex && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: 'white',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Box>
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
            Save Annotations ({rectangles.length})
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          display: 'inline-block',
          p: 2,
          borderRadius: 3,
          background: GRADIENTS.CANVAS,
        }}
      >
        <Box
          sx={{
            cursor: 'crosshair',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            overflow: 'hidden',
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
        </Box>
      </Paper>
    </Box>
  );
}
