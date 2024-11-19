import express from 'express';
import { login, register, listUsers } from '../controllers/authController';

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/users', listUsers);
