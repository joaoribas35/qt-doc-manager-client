export type Company = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  users: {
    id: string;
    name: string;
    email: string;
  }[];
};
