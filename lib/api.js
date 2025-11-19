import { localStorageAPI } from './localStorage';

export const categoriesAPI = {
  getAll: async () => {
    return localStorageAPI.categories.getAll();
  },

  getById: async (id) => {
    return localStorageAPI.categories.getById(id);
  },

  create: async (categoryData) => {
    return localStorageAPI.categories.create(categoryData);
  },

  update: async (id, categoryData) => {
    return localStorageAPI.categories.update(id, categoryData);
  },

  delete: async (id) => {
    return localStorageAPI.categories.delete(id);
  },
};

export const imagesAPI = {
  getAll: async () => {
    return localStorageAPI.images.getAll();
  },

  getById: async (id) => {
    return localStorageAPI.images.getById(id);
  },

  create: async (imageData) => {
    return localStorageAPI.images.create(imageData);
  },

  update: async (id, imageData) => {
    return localStorageAPI.images.update(id, imageData);
  },

  delete: async (id) => {
    return localStorageAPI.images.delete(id);
  },
};

export const annotationsAPI = {
  getAll: async () => {
    return localStorageAPI.annotations.getAll();
  },

  getByImageId: async (imageId) => {
    return localStorageAPI.annotations.getByImageId(imageId);
  },

  create: async (annotationData) => {
    return localStorageAPI.annotations.create(annotationData);
  },

  update: async (id, annotationData) => {
    return localStorageAPI.annotations.update(id, annotationData);
  },

  delete: async (id) => {
    return localStorageAPI.annotations.delete(id);
  },
};
