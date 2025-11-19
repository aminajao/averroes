const STORAGE_KEYS = {
  CATEGORIES: 'image_manager_categories',
  IMAGES: 'image_manager_images',
  ANNOTATIONS: 'image_manager_annotations',
  INITIALIZED: 'image_manager_initialized',
};

const JSON_API_BASE = 'https://my-json-server.typicode.com/MostafaKMilly/demo';

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

const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${JSON_API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API fetch failed');
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
};

export const initializeStorage = async () => {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!isInitialized) {
    console.log('Fetching initial data from JSON API...');

    const [categories, images] = await Promise.all([
      fetchFromAPI('/categories'),
      fetchFromAPI('/images'),
    ]);

    if (categories && categories.length > 0) {
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      console.log('Cached categories from API:', categories.length);
    }

    if (images && images.length > 0) {
      saveToStorage(STORAGE_KEYS.IMAGES, images);
      console.log('Cached images from API:', images.length);
    }

    if (!localStorage.getItem(STORAGE_KEYS.ANNOTATIONS)) {
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, []);
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('LocalStorage initialized with JSON API data');
  } else {
    console.log('Using cached data from localStorage');
  }
};

export const localStorageAPI = {
  categories: {
    getAll: async () => {
      return getFromStorage(STORAGE_KEYS.CATEGORIES);
    },

    getById: async (id) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      return categories.find(c => String(c.id) === String(id)) || null;
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
      const index = categories.findIndex(c => String(c.id) === String(id));
      if (index === -1) throw new Error('Category not found');

      categories[index] = { ...categories[index], ...data };
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      return categories[index];
    },

    delete: async (id) => {
      const categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
      const filtered = categories.filter(c => String(c.id) !== String(id));
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
      return images.find(img => String(img.id) === String(id)) || null;
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
      const index = images.findIndex(img => String(img.id) === String(id));
      if (index === -1) throw new Error('Image not found');

      images[index] = { ...images[index], ...data };
      saveToStorage(STORAGE_KEYS.IMAGES, images);
      return images[index];
    },

    delete: async (id) => {
      const images = getFromStorage(STORAGE_KEYS.IMAGES);
      const filtered = images.filter(img => String(img.id) !== String(id));
      saveToStorage(STORAGE_KEYS.IMAGES, filtered);

      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const filteredAnnotations = annotations.filter(ann => String(ann.imageId) !== String(id));
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
      const filtered = annotations.filter(ann => String(ann.imageId) === String(imageId));
      console.log('=== GET ANNOTATIONS FOR IMAGE ===');
      console.log('Image ID requested:', imageId);
      console.log('Total annotations in storage:', annotations.length);
      console.log('All annotations:', annotations);
      console.log('Filtered annotations for this image:', filtered);
      return filtered;
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
      console.log('=== ANNOTATION SAVED ===');
      console.log('New annotation:', newAnnotation);
      console.log('Total annotations now:', annotations.length);
      return newAnnotation;
    },

    update: async (id, data) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const index = annotations.findIndex(ann => String(ann.id) === String(id));
      if (index === -1) throw new Error('Annotation not found');

      annotations[index] = { ...annotations[index], ...data };
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, annotations);
      return annotations[index];
    },

    delete: async (id) => {
      const annotations = getFromStorage(STORAGE_KEYS.ANNOTATIONS);
      const filtered = annotations.filter(ann => String(ann.id) !== String(id));
      saveToStorage(STORAGE_KEYS.ANNOTATIONS, filtered);
      return { success: true };
    },
  },
};
