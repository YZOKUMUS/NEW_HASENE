const fs = require('fs');
describe('Manifest and Config Files', () => {
  it('manifest.json should exist and be valid JSON', () => {
    const data = fs.readFileSync('manifest.json', 'utf8');
    expect(() => JSON.parse(data)).not.toThrow();
  });
  it('browserconfig.xml should exist and contain <browserconfig>', () => {
    const xml = fs.readFileSync('browserconfig.xml', 'utf8');
    expect(xml).toMatch(/<browserconfig>/);
  });
});
