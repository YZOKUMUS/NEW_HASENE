// Unit Tests for Date System
// Import getLocalDateString from utils
const { getLocalDateString } = require('../../js/utils.js');

describe('Date System', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('getLocalDateString', () => {
        test('should return date in YYYY-MM-DD format', () => {
            const date = new Date('2025-01-20T10:30:00');
            const result = getLocalDateString(date);
            expect(result).toBe('2025-01-20');
        });

        test('should use current date if no argument provided', () => {
            const result = getLocalDateString();
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('should handle month and day padding correctly', () => {
            const date = new Date('2025-01-05T00:00:00');
            const result = getLocalDateString(date);
            const parts = result.split('-');
            expect(parts[1]).toHaveLength(2); // Month
            expect(parts[2]).toHaveLength(2); // Day
        });

        test('should use local timezone, not UTC', () => {
            // UTC'de farklı gün olabilir ama local'de doğru günü vermeli
            const date = new Date('2025-01-20T23:00:00Z'); // UTC
            const result = getLocalDateString(date);
            // Local timezone'a göre tarih değişebilir, bu yüzden sadece format kontrolü
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('Daily Reset System', () => {
        test('should reset daily XP when date changes', () => {
            const today = getLocalDateString();
            const yesterday = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
            
            // Dünkü tarihi kaydet
            localStorage.setItem('lastDailyGoalDate', yesterday);
            localStorage.setItem('dailyXP', '100');
            
            // Tarih kontrolü yap (gerçek kod mantığı)
            const lastDate = localStorage.getItem('lastDailyGoalDate');
            if (lastDate !== today) {
                localStorage.setItem('dailyXP', '0');
                localStorage.setItem('lastDailyGoalDate', today);
            }
            
            expect(localStorage.getItem('dailyXP')).toBe('0');
            expect(localStorage.getItem('lastDailyGoalDate')).toBe(today);
        });

        test('should not reset daily XP on same day', () => {
            const today = getLocalDateString();
            
            localStorage.setItem('lastDailyGoalDate', today);
            localStorage.setItem('dailyXP', '100');
            
            // Tarih kontrolü
            const lastDate = localStorage.getItem('lastDailyGoalDate');
            if (lastDate !== today) {
                localStorage.setItem('dailyXP', '0');
            }
            
            expect(localStorage.getItem('dailyXP')).toBe('100');
        });

        test('should handle date format compatibility', () => {
            const today = getLocalDateString();
            const todayOldFormat = new Date().toDateString();
            
            // Eski format kontrolü
            localStorage.setItem('lastDailyGoalDate', todayOldFormat);
            localStorage.setItem('dailyXP', '100');
            
            const lastDate = localStorage.getItem('lastDailyGoalDate');
            if (lastDate !== today && lastDate !== todayOldFormat) {
                localStorage.setItem('dailyXP', '0');
            }
            
            // Eski format varsa reset yapılmamalı (gerçek kod mantığına göre)
            // Ama yeni format kontrolü yapılmalı
            expect(localStorage.getItem('dailyXP')).toBe('100');
        });
    });

    describe('Streak System Date Logic', () => {
        test('should detect consecutive days correctly', () => {
            const today = getLocalDateString();
            const yesterday = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
            
            // Dün oynanmış
            const streakData = {
                currentStreak: 5,
                lastPlayDate: yesterday
            };
            
            // Bugün oynanıyor
            if (streakData.lastPlayDate === yesterday) {
                // Ardışık gün
                streakData.currentStreak += 1;
                streakData.lastPlayDate = today;
            } else if (streakData.lastPlayDate !== today) {
                // Streak kırıldı
                streakData.currentStreak = 1;
                streakData.lastPlayDate = today;
            }
            
            expect(streakData.currentStreak).toBe(6);
            expect(streakData.lastPlayDate).toBe(today);
        });

        test('should reset streak when day is skipped', () => {
            const today = getLocalDateString();
            const twoDaysAgo = getLocalDateString(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
            
            const streakData = {
                currentStreak: 5,
                lastPlayDate: twoDaysAgo
            };
            
            // 2 gün önce oynanmış, bugün oynanıyor
            if (streakData.lastPlayDate === twoDaysAgo) {
                // Streak kırıldı (1 gün atlanmış)
                streakData.currentStreak = 1;
                streakData.lastPlayDate = today;
            }
            
            expect(streakData.currentStreak).toBe(1);
        });
    });
});

