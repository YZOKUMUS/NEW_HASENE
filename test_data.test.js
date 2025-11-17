const fs = require('fs');
describe('JSON Data Files', () => {
  it('ayetoku_formatted.json should exist and be valid JSON', () => {
    const data = fs.readFileSync('ayetoku_formatted.json', 'utf8');
    expect(() => JSON.parse(data)).not.toThrow();
  });
  it('duaet.json should exist and be valid JSON', () => {
    const data = fs.readFileSync('duaet.json', 'utf8');
    expect(() => JSON.parse(data)).not.toThrow();
  });
  it('hadisoku.json should exist and be valid JSON', () => {
    const data = fs.readFileSync('hadisoku.json', 'utf8');
    expect(() => JSON.parse(data)).not.toThrow();
  });
  it('kelimebul.json should exist and be valid JSON', () => {
    const data = fs.readFileSync('kelimebul.json', 'utf8');
    expect(() => JSON.parse(data)).not.toThrow();
  });
});
