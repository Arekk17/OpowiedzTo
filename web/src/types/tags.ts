export type Tag = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TagsResponse = {
  data: Tag[];
  total: number;
};
