const fs = require('fs');
describe('HTML Structure', () => {
  it('index.html should contain all main sections', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toMatch(/class="main-menu"/);
    expect(html).toMatch(/class="flutter-game-grid"/);
    expect(html).toMatch(/class="premium-stats-panel"/);
    expect(html).toMatch(/class="game-card"/);
    expect(html).toMatch(/class="flutter-top-nav"/);
  });
});
