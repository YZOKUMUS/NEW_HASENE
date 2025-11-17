const fs = require('fs');
describe('Manifest Link in HTML', () => {
  it('index.html should link manifest.json', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toMatch(/<link rel="manifest" href="manifest.json">/);
  });
});
