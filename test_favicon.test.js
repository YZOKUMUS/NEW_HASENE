const fs = require('fs');
describe('Favicon', () => {
  it('index.html should link favicon', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toMatch(/<link rel="icon" type="image\/png" href="icon-192-v4-RED-MUSHAF.png">/);
  });
});
