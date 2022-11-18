import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import User from '../database/models/user.model';

dotenv.config();

const wordSecret = process.env.JWT_SECRET as string;

export default class ValidateToken {
  public validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    try {
      const decoded = jwt.verify(token, wordSecret);
      const { username } = decoded as { username: string };
      const user = User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Expired or invalid token' });
    }
  };
}
