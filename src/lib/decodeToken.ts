import jwt from 'jsonwebtoken';

export interface UserInfo {
  id?: string;
  email?: string;
  role?: string;
  policy?: [];
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
