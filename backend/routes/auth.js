const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserStats = require('../models/UserStats');

// Google OAuth Login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Initialize user stats if not exists
      let userStats = await UserStats.findOne({ userId: req.user._id });
      if (!userStats) {
        userStats = await UserStats.create({
          userId: req.user._id,
          dailyTasks: {
            todayStats: {
              allGameModes: [],
              farklıZorluk: [],
              reviewWords: [],
              ayetOku: 0,
              duaEt: 0,
              hadisOku: 0
            }
          },
          weeklyTasks: {
            weekStats: {
              allModesPlayed: []
            }
          },
          gameStats: {
            totalCorrect: 0,
            totalWrong: 0,
            gameModeCounts: {
              'kelime-cevir': 0,
              'dinle-bul': 0,
              'bosluk-doldur': 0,
              'ayet-oku': 0,
              'dua-et': 0,
              'hadis-oku': 0
            }
          }
        });
      }

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
      res.redirect(`${frontendUrl}?token=${token}`);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;

