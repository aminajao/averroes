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

  useEffect(() => {
    if (image) {
      onImageLoad(image);
    }
  }, [image, onImageLoad]);

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

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Annotation Tools
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2">Select Color:</Typography>
          <ButtonGroup>
            {colors.map((color) => (
              <Button
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  bgcolor: color,
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  border: selectedColor === color ? '3px solid #000' : '1px solid #ccc',
                  '&:hover': {
                    bgcolor: color,
                    opacity: 0.8,
                  },
                }}
              />
            ))}
          </ButtonGroup>
          <Button variant="outlined" onClick={handleDeleteLast} disabled={rectangles.length === 0}>
            Delete Last
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Annotations
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Click and drag to draw rectangles on the image
        </Typography>
      </Paper>

      <Paper sx={{ display: 'inline-block', p: 2 }}>
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
