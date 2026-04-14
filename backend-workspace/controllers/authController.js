import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, ProfileOwner, Client } from '../models.js';

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, profileData = {} } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    // Create role-specific profile
    if (role === 'profile_owner') {
      await ProfileOwner.create({
        userId: user.id,
        phoneNumber,
        ...profileData,
        profileCompletion: 20 // Basic info completed
      });
    } else if (role === 'client') {
      await Client.create({
        userId: user.id,
        phoneNumber,
        ...profileData
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Prepare user data for response (exclude password)
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with associated profile
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: ProfileOwner,
          required: false
        },
        {
          model: Client,
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Prepare user data for response
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    // Add role-specific profile data
    if (user.role === 'profile_owner' && user.ProfileOwner) {
      userResponse.profile = user.ProfileOwner;
    } else if (user.role === 'client' && user.Client) {
      userResponse.profile = user.Client;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
};

const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists for security
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id, type: 'password_reset' },
      process.env.JWT_RESET_SECRET || process.env.JWT_SECRET + '_reset',
      { expiresIn: '1h' }
    );

    // In a real application, you would:
    // 1. Save the reset token to the database
    // 2. Send an email with the reset link
    // 3. Implement rate limiting

    // For development, log the token
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET || process.env.JWT_SECRET + '_reset'
    );

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      });
    }

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'
    );

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to refresh token'
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by authenticateToken middleware
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: ProfileOwner,
          required: false
        },
        {
          model: Client,
          required: false
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    // Add role-specific profile data
    if (user.role === 'profile_owner' && user.ProfileOwner) {
      userResponse.profile = user.ProfileOwner;
    } else if (user.role === 'client' && user.Client) {
      userResponse.profile = user.Client;
    }

    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data'
    });
  }
};

export {
register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  getCurrentUser
};