import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'docon-go-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
