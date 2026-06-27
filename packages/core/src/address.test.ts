import { parseVietnamHouseNumber, formatVietnamHouseNumber } from './address';

describe('parseVietnamHouseNumber', () => {
  // ── Basic cases ──────────────────────────────────────────────────────────
  it('parses a simple street number', () => {
    expect(parseVietnamHouseNumber('123')).toEqual({
      mainNumber: '123',
      alleys: [],
      houseNumber: '123',
      original: '123',
    });
  });

  it('parses an address with one alley (no intermediate alleys)', () => {
    expect(parseVietnamHouseNumber('123/45')).toEqual({
      mainNumber: '123',
      alleys: [],
      houseNumber: '45',
      original: '123/45',
    });
  });

  it('parses an address with multiple alley levels', () => {
    expect(parseVietnamHouseNumber('252/45/14/7')).toEqual({
      mainNumber: '252',
      alleys: ['45', '14'],
      houseNumber: '7',
      original: '252/45/14/7',
    });
  });

  it('parses deeply nested 5-level alley', () => {
    expect(parseVietnamHouseNumber('10/2/3/4/5')).toEqual({
      mainNumber: '10',
      alleys: ['2', '3', '4'],
      houseNumber: '5',
      original: '10/2/3/4/5',
    });
  });

  // ── Whitespace handling ───────────────────────────────────────────────────
  it('trims outer whitespace and stores trimmed string as original', () => {
    expect(parseVietnamHouseNumber('  252/45/14/7  ')).toEqual({
      mainNumber: '252',
      alleys: ['45', '14'],
      houseNumber: '7',
      original: '252/45/14/7',
    });
  });

  it('trims whitespace around each slash-separated part', () => {
    expect(parseVietnamHouseNumber('252 / 45 / 14 / 7')).toEqual({
      mainNumber: '252',
      alleys: ['45', '14'],
      houseNumber: '7',
      original: '252 / 45 / 14 / 7',
    });
  });

  it('trims outer AND inner whitespace together', () => {
    expect(parseVietnamHouseNumber('  252 / 45 / 14 / 7  ')).toEqual({
      mainNumber: '252',
      alleys: ['45', '14'],
      houseNumber: '7',
      original: '252 / 45 / 14 / 7',
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────────
  it('handles empty string input', () => {
    expect(parseVietnamHouseNumber('')).toEqual({
      mainNumber: '',
      alleys: [],
      houseNumber: '',
      original: '',
    });
  });

  it('handles whitespace-only input', () => {
    expect(parseVietnamHouseNumber('   ')).toEqual({
      mainNumber: '',
      alleys: [],
      houseNumber: '',
      original: '',
    });
  });

  it('handles a bare slash "/"', () => {
    expect(parseVietnamHouseNumber('/')).toEqual({
      mainNumber: '',
      alleys: [],
      houseNumber: '',
      original: '/',
    });
  });

  it('handles alphanumeric suffixes like 123/5A', () => {
    expect(parseVietnamHouseNumber('123/5A')).toEqual({
      mainNumber: '123',
      alleys: [],
      houseNumber: '5A',
      original: '123/5A',
    });
  });
});

// ── formatVietnamHouseNumber ──────────────────────────────────────────────────
describe('formatVietnamHouseNumber', () => {
  it('formats a simple number (no alleys, same main+house)', () => {
    const parsed = parseVietnamHouseNumber('123');
    expect(formatVietnamHouseNumber(parsed)).toBe('123');
  });

  it('formats a single-alley address', () => {
    const parsed = parseVietnamHouseNumber('123/45');
    expect(formatVietnamHouseNumber(parsed)).toBe('123/45');
  });

  it('formats a multi-alley address', () => {
    const parsed = parseVietnamHouseNumber('252/45/14/7');
    expect(formatVietnamHouseNumber(parsed)).toBe('252/45/14/7');
  });

  it('round-trips: parse then format returns canonical form', () => {
    const inputs = ['123', '123/45', '252/45/14/7', '10/2/3/4/5', '123/5A'];
    for (const input of inputs) {
      expect(formatVietnamHouseNumber(parseVietnamHouseNumber(input))).toBe(input);
    }
  });
});
