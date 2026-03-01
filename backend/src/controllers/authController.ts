import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { prisma } from "../utils/prisma";

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * REGISTER
 */
export const register = async (req: AuthRequest, res: Response) => {
  try {
    let { email, password, confirmPassword, name } = req.body;

    // Check required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Email, password and confirm password are required",
      });
    }

    // Normalize email
    email = email.toLowerCase().trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    // Confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Strong password validation
    const isStrong = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    });

    if (!isStrong) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase and number",
      });
    }

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name?.trim() || null,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};


/**
 * LOGIN
 */
export const login = async (req: AuthRequest, res: Response) => {
  try {
    let { email, password } = req.body;

    // Required validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Normalize inputs
    email = email.toLowerCase().trim();
    password = password.trim();

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address",
      });
    }

    // Password length validation (basic)
    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};


/**
 * GET CURRENT USER
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return res.json(user);

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
    });
  }
};