const fs = require('fs');
describe('CSS Style', () => {
  it('style.css should exist and contain .main-menu and .flutter-game-grid', () => {
    const css = fs.readFileSync('style.css', 'utf8');
    expect(css).toMatch(/\.main-menu/);
    expect(css).toMatch(/\.flutter-game-grid/);
  });
});
