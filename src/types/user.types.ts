export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type User = {
  email: string;
  name: string;
  role: UserRole;
  token?: string;
};
