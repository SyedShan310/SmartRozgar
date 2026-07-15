import jwt from 'jsonwebtoken';

const getSecret = () => process.env.JWT_SECRET || 'smartrorozgar_dev_secret';

export const signToken = (payload) =>
  jwt.sign(payload, getSecret(), { expiresIn: '7d' });

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, getSecret());
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};
