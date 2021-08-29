/**
 * Get Senator Image url
 *
 * @param {{ name: string }} person Person object with a name key
 * @returns {string} senator's image path
 */
const getPhotoUrl = (person) => {
  const name = person.name.toLowerCase().replaceAll(' ', '_');
  return `dist/photos/${name}.jpg`;
};

export { getPhotoUrl };
