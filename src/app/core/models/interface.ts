export interface User {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  roles?: { _id: string; name: string; priority: number; permissions: string[] }[];
  permissions?: string[];
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface Token {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
