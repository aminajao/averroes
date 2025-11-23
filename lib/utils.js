export const filterImages = (images, { searchQuery, categoryFilter }) => {
  if (!images) return [];

  return images.filter((image) => {
    const matchesSearch =
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (image.metadata &&
        JSON.stringify(image.metadata).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !categoryFilter || image.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });
};

export const formatDate = (dateString, locale = 'en-US') => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCategoryName = (categories, categoryId) => {
  const category = categories?.find((cat) => cat.id === categoryId);
  return category?.name || 'Uncategorized';
};

export const paginateArray = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};

export const calculateTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({ top: 0, behavior });
};
