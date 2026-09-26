import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store';
import { IUser } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Please provide full name, email, and password.' });
      return;
    }

    // Check if user already exists
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        res.status(400).json({ error: 'An account with this email already exists.' });
        return;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      id: uuidv4(),
      name,
      email,
      passwordHash,
      preferences: {
        soloDwellerMode: true,
        dietaryRestrictions: ['High Protein'],
        cookingSkill: 'Intermediate',
        maxCookTimeMinutes: 30,
        spiceTolerance: 'Medium',
        defaultServings: 1,
      },
      notifications: {
        sameDayExpiry: true,
        twoDayWarning: true,
        recipeRescue: true,
        dinnerPrompt: true,
        weeklyDigest: false,
        pushEnabled: true,
        emailDigest: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.set(newUser.id, newUser);

    const secret = process.env.JWT_SECRET || 'fridgeai_jwt_super_secret_key_2026';
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, secret, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        preferences: newUser.preferences,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please provide both email and password.' });
      return;
    }

    let user: IUser | undefined;
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        user = u;
        break;
      }
    }

    // Allow quick demo login with default demo account
    if (!user && email.toLowerCase() === 'alex.morgan@email.com') {
      user = store.users.get('user-alex-1');
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fridgeai_jwt_super_secret_key_2026';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const user = store.users.get(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      notifications: user.notifications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = getMe;
