import { User } from "../models/user-model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// this is for reg company as well reg hr
export const registerUser = async (req, res) => {
  try {
    const { email, password, role, companyName } = await req.body;


    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      role,
    };

    if (role === "COMPANY") {
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      userData.companyName = companyName;
    } else if (role === "HR") {
      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }
      const company = await User.findOne({ _id: companyId, role: "COMPANY" });
      if (!company) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      userData.companyId = companyId;
    }

    const user =  User.create(userData);

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// this if for login company as well login hr
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // if company login then company id will become _id and for hr login companyId will be companyId
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role,
                companyId: user.role === 'HR' ? user.companyId : user._id 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

         res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Required for HTTPS
            sameSite: 'None', // Required for cross-domain cookies
            maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
            path: '/', // Cookie is available for all paths
        });

      return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                companyId: user.companyId
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get HR users for a company
export const getHrByCompanyId = async (req, res) => {
    try {
        if (req.user.role !== 'COMPANY') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const hrUsers = await User.find({
            role: 'HR',
            companyId: req.user.userId
        }).select('-password');

        if (!hrUsers.length) {
            return res.status(404).json({ message: 'No HR users found' });
        }

        return res.status(200).json(hrUsers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get User Details 
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
