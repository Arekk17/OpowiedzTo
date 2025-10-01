export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
};
export const getPostUrl = (id: string, text: string) => {
  const slug = generateSlug(text);
  return `/history/${id}/${slug}`;
};
