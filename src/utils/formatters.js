export const formatCategory = (categoryName) => {
  if (!categoryName) return '';
  const lower = categoryName.toLowerCase();
  if (lower === 'organic') return 'Organik';
  if (lower === 'inorganic') return 'Anorganik';
  if (lower === 'hazardous') return 'B3';
  return categoryName;
};
