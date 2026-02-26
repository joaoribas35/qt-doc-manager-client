export function formatSlugToName(slug: string) {
  const name = slug.replace(/-/g, ' ');
  const splitName = name.split(' ');
  return splitName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
