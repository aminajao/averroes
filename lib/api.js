const BASE_URL = 'https://my-json-server.typicode.com/MostafaKMilly/demo';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const categoriesAPI = {
  getAll: () => fetchAPI('/categories'),
  getById: (id) => fetchAPI(`/categories/${id}`),
  create: (data) => fetchAPI('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

export const imagesAPI = {
  getAll: () => fetchAPI('/images'),
  getById: (id) => fetchAPI(`/images/${id}`),
  create: (data) => fetchAPI('/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/images/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/images/${id}`, {
    method: 'DELETE',
  }),
};

export const annotationsAPI = {
  getAll: () => fetchAPI('/annotations'),
  getByImageId: (imageId) => fetchAPI(`/images/${imageId}/annotations`),
  create: (data) => fetchAPI('/annotations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/annotations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/annotations/${id}`, {
    method: 'DELETE',
  }),
};
