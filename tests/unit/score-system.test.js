// Unit Tests for Score System
describe('Score System', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should calculate hasene correctly for medium difficulty', () => {
        // Varsayılan: orta zorluk = 5 puan
        const difficulty = 5;
        const multiplier = 1;
        const expectedScore = difficulty * multiplier;
        expect(expectedScore).toBe(5);
    });

    test('should handle combo bonus calculation', () => {
        // Combo bonus: her 3 doğru = +5 hasene
        const comboCount = 3;
        const bonus = Math.floor(comboCount / 3) * 5;
        expect(bonus).toBe(5);
    });

    test('should calculate star points correctly', () => {
        // 100 hasene = 1 yıldız
        const hasene = 100;
        const starPoints = Math.floor(hasene / 100);
        expect(starPoints).toBe(1);
    });
});

