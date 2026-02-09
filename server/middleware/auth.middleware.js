import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('Auth Failed: No token provided in cookies');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticate;
