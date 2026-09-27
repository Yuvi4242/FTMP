import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { DBService } from '../services/dbService';
import { store } from '../services/store';
import { IUser } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Please provide full name, email, and password.' });
      return;
    }

    const existingUser = await DBService.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
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

    await DBService.saveUser(newUser);

    // Provide a rich starter fridge for the new solo dweller
    const now = new Date();
    const addDays = (d: Date, days: number) => {
      const res = new Date(d);
      res.setDate(res.getDate() + days);
      return res.toISOString();
    };

    const starterItems: any[] = [
      {
        id: uuidv4(),
        userId: newUser.id,
        name: 'Eggs (Free Range)',
        quantity: 6,
        unit: 'count',
        category: 'Dairy & Eggs',
        storageLocation: 'Fridge Door',
        purchaseDate: addDays(now, -2),
        expiryDate: addDays(now, 4),
        expiryStatus: 'soon',
        daysUntilExpiry: 4,
        addedViaScan: false,
        imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=300&q=80',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: newUser.id,
        name: 'Fresh Spinach',
        quantity: 1,
        unit: 'bag',
        category: 'Produce',
        storageLocation: 'Crisper Drawer',
        purchaseDate: addDays(now, -1),
        expiryDate: addDays(now, 2),
        expiryStatus: 'soon',
        daysUntilExpiry: 2,
        addedViaScan: false,
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: newUser.id,
        name: 'Almond Milk',
        quantity: 1,
        unit: 'carton (1L)',
        category: 'Dairy & Eggs',
        storageLocation: 'Main Shelf',
        purchaseDate: addDays(now, -3),
        expiryDate: addDays(now, 5),
        expiryStatus: 'fresh',
        daysUntilExpiry: 5,
        addedViaScan: false,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: newUser.id,
        name: 'Cheddar Cheese',
        quantity: 200,
        unit: 'g',
        category: 'Dairy & Eggs',
        storageLocation: 'Crisper Drawer',
        purchaseDate: addDays(now, -5),
        expiryDate: addDays(now, 1),
        expiryStatus: 'critical',
        daysUntilExpiry: 1,
        addedViaScan: false,
        imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&q=80',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    for (const item of starterItems) {
      await DBService.saveInventoryItem(item);
    }

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

    let user = await DBService.getUserByEmail(email);

    // Fallback demo user
    if (!user && email.toLowerCase() === 'alex.morgan@email.com') {
      user = store.users.get('user-alex-1') || null;
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password if not demo hash
    if (user.passwordHash && !user.passwordHash.includes('DEMO_HASH')) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
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
    const user = await DBService.getUserById(userId);
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
