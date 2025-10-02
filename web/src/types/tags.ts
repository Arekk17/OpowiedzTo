export type TagType = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TagsResponse = {
  data: TagType[];
  total: number;
};
