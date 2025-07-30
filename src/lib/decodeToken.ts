import jwt from 'jsonwebtoken';

export type ResourcePermission = 'Manage' | 'Create';

export interface Policy {
  access: boolean;
  resources?: ResourcePermission[];
}
export interface UserInfo {
  id?: string;
  email?: string;
  role?: string;
  policy?: Policy[];
  token?: string;
}

export const decodeToken = (token: string): UserInfo | null => {
  try {
    const decoded = jwt.decode(token) as UserInfo;
    return decoded;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};
