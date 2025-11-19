import { supabase } from './supabase';

export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  create: async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

export const imagesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data.map(img => ({
      ...img,
      categoryId: img.category_id,
      uploadDate: img.upload_date,
    }));
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      categoryId: data.category_id,
      uploadDate: data.upload_date,
    };
  },

  create: async (imageData) => {
    const dbData = {
      name: imageData.name,
      url: imageData.url,
      category_id: imageData.categoryId,
      metadata: imageData.metadata || {},
      upload_date: imageData.uploadDate || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('images')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      categoryId: data.category_id,
      uploadDate: data.upload_date,
    };
  },

  update: async (id, imageData) => {
    const dbData = {
      name: imageData.name,
      url: imageData.url,
      category_id: imageData.categoryId,
      metadata: imageData.metadata,
    };

    const { data, error } = await supabase
      .from('images')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      categoryId: data.category_id,
      uploadDate: data.upload_date,
    };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

export const annotationsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('annotations')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(ann => ({
      ...ann,
      imageId: ann.image_id,
    }));
  },

  getByImageId: async (imageId) => {
    const { data, error } = await supabase
      .from('annotations')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(ann => ({
      ...ann,
      imageId: ann.image_id,
    }));
  },

  create: async (annotationData) => {
    const dbData = {
      image_id: annotationData.imageId,
      x: annotationData.x,
      y: annotationData.y,
      width: annotationData.width,
      height: annotationData.height,
      color: annotationData.color,
      label: annotationData.label || '',
    };

    const { data, error } = await supabase
      .from('annotations')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      imageId: data.image_id,
    };
  },

  update: async (id, annotationData) => {
    const dbData = {
      x: annotationData.x,
      y: annotationData.y,
      width: annotationData.width,
      height: annotationData.height,
      color: annotationData.color,
      label: annotationData.label,
    };

    const { data, error } = await supabase
      .from('annotations')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      imageId: data.image_id,
    };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('annotations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};
