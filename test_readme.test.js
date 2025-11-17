const fs = require('fs');
describe('README.md', () => {
  it('should exist and mention all game modes', () => {
    const readme = fs.readFileSync('README.md', 'utf8');
    expect(readme).toMatch(/Kelime Çevir/);
    expect(readme).toMatch(/Dinle ve Bul/);
    expect(readme).toMatch(/Boşluk Doldur/);
    expect(readme).toMatch(/Ayet Oku/);
    expect(readme).toMatch(/Dua Öğren/);
    expect(readme).toMatch(/Hadis Oku/);
  });
});
