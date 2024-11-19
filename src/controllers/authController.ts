import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dynamoDbClient from '../aws/dynamoDbClient';

interface User {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const params = { 
    TableName: 'pruebitas_users',
    Item: {
        email,
        password: hashedPassword
    }
  }
  await dynamoDbClient.put(params).promise();
  res.status(201).json({ message: 'User registered successfully' });
  return ;
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await dynamoDbClient.get({
        TableName: 'pruebitas_users',
        Key: {
            email
        }
    }).promise();
    console.log(result);
    if (!result.Item) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const user : User = result.Item as User;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
    return;
};

export const listUsers = async (req: Request, res: Response) => {
    const result = await dynamoDbClient.scan({
        TableName: 'pruebitas_users'
    }).promise();
    res.json(result);
};