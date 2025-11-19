const STORAGE_KEYS = {
  CATEGORIES: 'image_manager_categories',
  IMAGES: 'image_manager_images',
  ANNOTATIONS: 'image_manager_annotations',
};

const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getFromStorage = (key) => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    const defaultCategories = [
      { id: generateId(), name: 'Nature', description: 'Natural landscapes and wildlife', created_at: new Date().toISOString() },
      { id: generateId(), name: 'Architecture', description: 'Buildings and structures', created_at: new Date().toISOString() },
      { id: generateId(), name: 'Technology', description: 'Tech products and gadgets', created_at: new Date().toISOString() },
      { id: generateId(), name: 'People', description: 'Portraits and group photos', created_at: new Date().toISOString() },
    ];
    saveToStorage(STORAGE_KEYS.CATEGORIES, defaultCategories);
  }

  if (!localStorage.getItem(STORAGE_KEYS.IMAGES)) {
    const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
    const natureCategory = categories.find(c => c.name === 'Nature');
    const archCategory = categories.find(c => c.name === 'Architecture');

    const defaultImages = [
      {
        id: generateId(),
        name: 'Sample Mountain View',
        url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg',
        categoryId: natureCategory?.id,
        metadata: { resolution: '1920x1080', size: 'large' },
        uploadDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Modern Building',
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
        categoryId: archCategory?.id,
        metadata: { resolution: '1920x1280', size: 'medium' },
        uploadDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.IMAGES, defaultImages);
  }

  if (!localStorage.getItem(STORAGE_KEYS.ANNOTATIONS)) {
    saveToStorage(STORAGE_KEYS.ANNOTATIONS, []);
  }
};

export const localStorageAPI = {
  categories: {
    getAll: async () => {
      return getFromStorage(STORAGE_KEYS.CATEGORIES);
    },

    getById: async (id) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      return categories.find(c => c.id === id) || null;
    },

    create: async (data) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      const newCategory = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      categories.push(newCategory);
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      return newCategory;
    },

    update: async (id, data) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      const index = categories.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Category not found');

      categories[index] = { ...categories[index], ...data };
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      return categories[index];
    },

    delete: async (id) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      const filtered = categories.filter(c => c.id !== id);
      saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
      return { success: true };
    },
  },

  images: {
    getAll: async () => {
      return getFromStorage(STORAGE_KEYS.IMAGES);
    },

    getById: async (id) => {
      const images = getFromStorage(STORAGE_KEYS.IMAGES);
      return images.find(img => img.id === id) || null;
    },

    create: async (data) => {
      const images = getFromStorage(STORAGE_KEYS.IMAGES);
      const newImage = {
        id: generateId(),
        ...data,
        uploadDate: data.uploadDate || new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      images.push(newImage);
      saveToStorage(STORAGE_KEYS.IMAGES, images);
      return newImage;
    },

    update: async (id, data) => {
      const images = getFromStorage(STORAGE_KEYS.IMAGES);
      const index = images.findIndex(img => img.id === id);
      if (index === -1) throw new Error('Image not found');

      images[index] = { ...images[index], ...data };
      saveToStorage(STORAGE_KEYS.IMAGES, images);
      return images[index];
    },

    delete: async (id) => {
      const images = getFromStorage(STORAGE_KEYS.IMAGES);
      const filtered = images.filter(img => img.id !== id);
      saveToStorage(STORAGE_KEYS.IMAGES, filtered);

      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const filteredAnnotations = annotations.filter(ann => ann.imageId !== id);
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, filteredAnnotations);

      return { success: true };
    },
  },

  annotations: {
    getAll: async () => {
      return getFromStorage(STORAGE_KEYS.ANNOTATIONS);
    },

    getByImageId: async (imageId) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      return annotations.filter(ann => ann.imageId === imageId);
    },

    create: async (data) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const newAnnotation = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      annotations.push(newAnnotation);
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, annotations);
      return newAnnotation;
    },

    update: async (id, data) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const index = annotations.findIndex(ann => ann.id === id);
      if (index === -1) throw new Error('Annotation not found');

      annotations[index] = { ...annotations[index], ...data };
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, annotations);
      return annotations[index];
    },

    delete: async (id) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const filtered = annotations.filter(ann => ann.id !== id);
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, filtered);
      return { success: true };
    },
  },
};
