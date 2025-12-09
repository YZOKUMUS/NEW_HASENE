const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const UserStats = require('../models/UserStats');

// Get user stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    let userStats = await UserStats.findOne({ userId: req.user._id });

    if (!userStats) {
      // Initialize stats if not exists
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

    // Convert wordStats Map to Object for JSON response
    const wordStatsObj = {};
    if (userStats.wordStats && userStats.wordStats instanceof Map) {
      userStats.wordStats.forEach((value, key) => {
        wordStatsObj[key] = value;
      });
    } else if (userStats.wordStats) {
      Object.assign(wordStatsObj, userStats.wordStats);
    }

    const response = {
      ...userStats.toObject(),
      wordStats: wordStatsObj
    };

    res.json(response);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Update user stats
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updateData = req.body;

    // wordStats is already an object, keep it as is (MongoDB Mixed type accepts objects)
    // No need to convert to Map

    // Convert Set arrays back to arrays if needed
    if (updateData.dailyTasks?.todayStats) {
      if (Array.isArray(updateData.dailyTasks.todayStats.allGameModes)) {
        updateData.dailyTasks.todayStats.allGameModes = updateData.dailyTasks.todayStats.allGameModes;
      }
      if (Array.isArray(updateData.dailyTasks.todayStats.farklıZorluk)) {
        updateData.dailyTasks.todayStats.farklıZorluk = updateData.dailyTasks.todayStats.farklıZorluk;
      }
      if (Array.isArray(updateData.dailyTasks.todayStats.reviewWords)) {
        updateData.dailyTasks.todayStats.reviewWords = updateData.dailyTasks.todayStats.reviewWords;
      }
    }

    if (updateData.weeklyTasks?.weekStats) {
      if (Array.isArray(updateData.weeklyTasks.weekStats.allModesPlayed)) {
        updateData.weeklyTasks.weekStats.allModesPlayed = updateData.weeklyTasks.weekStats.allModesPlayed;
      }
    }

    updateData.lastUpdated = new Date();

    const userStats = await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Convert wordStats to Object for JSON response (if it exists)
    const wordStatsObj = userStats.wordStats || {};

    const response = {
      ...userStats.toObject(),
      wordStats: wordStatsObj
    };

    res.json(response);
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// Update specific stat field
router.patch('/:field', authenticateToken, async (req, res) => {
  try {
    const { field } = req.params;
    const value = req.body.value;

    const updateObj = {};
    updateObj[field] = value;
    updateObj.lastUpdated = new Date();

    const userStats = await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateObj },
      { new: true, upsert: true }
    );

    res.json(userStats);
  } catch (error) {
    console.error('Patch stats error:', error);
    res.status(500).json({ error: 'Failed to update stat' });
  }
});

module.exports = router;

