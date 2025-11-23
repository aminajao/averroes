export const PAGINATION = {
  IMAGES_PER_PAGE: 12,
};

export const TABS = {
  IMAGES: 0,
  CATEGORIES: 1,
};

export const ANNOTATION_COLORS = [
  { hex: '#ef4444', name: 'Red' },
  { hex: '#10b981', name: 'Green' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#f59e0b', name: 'Orange' },
  { hex: '#8b5cf6', name: 'Purple' },
  { hex: '#06b6d4', name: 'Cyan' },
];

export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  LIGHT: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  CANVAS: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
};

export const ITEM_TYPES = {
  IMAGE: 'image',
  CATEGORY: 'category',
};

export const MESSAGES = {
  IMAGE_UPLOADED: 'Image uploaded successfully',
  IMAGE_DELETED: 'Image deleted successfully',
  IMAGE_UPDATED: 'Image updated successfully',
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  UPLOAD_FAILED: 'Failed to upload',
  DELETE_FAILED: 'Failed to delete',
  UPDATE_FAILED: 'Failed to update',
  CREATE_FAILED: 'Failed to create',
};
