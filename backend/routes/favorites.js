const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const UserStats = require('../models/UserStats');

// Get favorite words
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userStats = await UserStats.findOne({ userId: req.user._id });
    
    if (!userStats) {
      return res.json([]);
    }

    res.json(userStats.favoriteWords || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add favorite word
router.post('/:wordId', authenticateToken, async (req, res) => {
  try {
    const { wordId } = req.params;
    
    const userStats = await UserStats.findOne({ userId: req.user._id });
    
    if (!userStats) {
      await UserStats.create({
        userId: req.user._id,
        favoriteWords: [wordId]
      });
      return res.json({ success: true, favoriteWords: [wordId] });
    }

    if (!userStats.favoriteWords.includes(wordId)) {
      userStats.favoriteWords.push(wordId);
      userStats.lastUpdated = new Date();
      await userStats.save();
    }

    res.json({ success: true, favoriteWords: userStats.favoriteWords });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove favorite word
router.delete('/:wordId', authenticateToken, async (req, res) => {
  try {
    const { wordId } = req.params;
    
    const userStats = await UserStats.findOne({ userId: req.user._id });
    
    if (!userStats) {
      return res.json({ success: true, favoriteWords: [] });
    }

    userStats.favoriteWords = userStats.favoriteWords.filter(id => id !== wordId);
    userStats.lastUpdated = new Date();
    await userStats.save();

    res.json({ success: true, favoriteWords: userStats.favoriteWords });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Toggle favorite word
router.post('/toggle/:wordId', authenticateToken, async (req, res) => {
  try {
    const { wordId } = req.params;
    
    let userStats = await UserStats.findOne({ userId: req.user._id });
    
    if (!userStats) {
      userStats = await UserStats.create({
        userId: req.user._id,
        favoriteWords: [wordId]
      });
      return res.json({ success: true, isFavorite: true, favoriteWords: [wordId] });
    }

    const index = userStats.favoriteWords.indexOf(wordId);
    const isFavorite = index !== -1;

    if (isFavorite) {
      userStats.favoriteWords.splice(index, 1);
    } else {
      userStats.favoriteWords.push(wordId);
    }

    userStats.lastUpdated = new Date();
    await userStats.save();

    res.json({ 
      success: true, 
      isFavorite: !isFavorite, 
      favoriteWords: userStats.favoriteWords 
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

module.exports = router;

