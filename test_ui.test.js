// UI smoke test for index.html
const fs = require('fs');
describe('index.html', () => {
  it('should exist and contain basic structure', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toMatch(/<title>Hasene Arapça Oyunu<\/title>/);
    expect(html).toMatch(/class="main-menu"/);
    expect(html).toMatch(/class="flutter-game-grid"/);
  });
});
