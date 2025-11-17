const fs = require('fs');
describe('Service Worker', () => {
  it('sw.js should exist and contain self.addEventListener', () => {
    const sw = fs.readFileSync('sw.js', 'utf8');
    expect(sw).toMatch(/self\.addEventListener/);
  });
});
