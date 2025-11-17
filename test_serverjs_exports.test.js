const fs = require('fs');
describe('server.js Exports', () => {
  it('server.js should export a function or app', () => {
    const code = fs.readFileSync('server.js', 'utf8');
    expect(code).toMatch(/module\.exports/);
  });
});
