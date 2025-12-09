const mongoose = require('mongoose');

const wordStatSchema = new mongoose.Schema({
  wordId: String,
  attempts: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  masteryLevel: { type: Number, default: 0 },
  lastCorrect: Date,
  lastWrong: Date,
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 },
  nextReviewDate: Date,
  lastReview: Date
}, { _id: false });

const streakDataSchema = new mongoose.Schema({
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastPlayDate: Date,
  streakHistory: [{
    date: Date,
    streak: Number
  }]
}, { _id: false });

const dailyTaskStatsSchema = new mongoose.Schema({
  allGameModes: [String],
  farklıZorluk: [String],
  reviewWords: [String],
  ayetOku: { type: Number, default: 0 },
  duaEt: { type: Number, default: 0 },
  hadisOku: { type: Number, default: 0 }
}, { _id: false });

const dailyTasksSchema = new mongoose.Schema({
  todayStats: dailyTaskStatsSchema,
  lastResetDate: Date
}, { _id: false });

const weeklyTaskStatsSchema = new mongoose.Schema({
  allModesPlayed: [String]
}, { _id: false });

const weeklyTasksSchema = new mongoose.Schema({
  weekStats: weeklyTaskStatsSchema,
  weekStartDate: Date
}, { _id: false });

const gameStatsSchema = new mongoose.Schema({
  totalCorrect: { type: Number, default: 0 },
  totalWrong: { type: Number, default: 0 },
  gameModeCounts: {
    'kelime-cevir': { type: Number, default: 0 },
    'dinle-bul': { type: Number, default: 0 },
    'bosluk-doldur': { type: Number, default: 0 },
    'ayet-oku': { type: Number, default: 0 },
    'dua-et': { type: Number, default: 0 },
    'hadis-oku': { type: Number, default: 0 }
  }
}, { _id: false });

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  badges: {
    stars: { type: Number, default: 0 },
    bronze: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    diamond: { type: Number, default: 0 }
  },
  streakData: streakDataSchema,
  dailyTasks: dailyTasksSchema,
  weeklyTasks: weeklyTasksSchema,
  wordStats: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  unlockedAchievements: [{
    id: String,
    unlockedAt: Date
  }],
  unlockedBadges: [{
    id: String,
    unlockedAt: Date
  }],
  perfectLessonsCount: {
    type: Number,
    default: 0
  },
  gameStats: gameStatsSchema,
  favoriteWords: [String],
  dailyGoalHasene: {
    type: Number,
    default: 2700
  },
  dailyGoalLevel: {
    type: String,
    default: 'normal'
  },
  dailyCorrect: {
    type: Number,
    default: 0
  },
  dailyWrong: {
    type: Number,
    default: 0
  },
  dailyXP: {
    type: Number,
    default: 0
  },
  lastDailyGoalDate: Date,
  onboardingSeen: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userStatsSchema.index({ userId: 1 });

module.exports = mongoose.model('UserStats', userStatsSchema);

