import { parseVietnamHouseNumber, formatVietnamHouseNumber } from './address';

// ── Stress: parse 100,000 addresses ──────────────────────────────────────────

describe('parseVietnamHouseNumber — stress (100k addresses)', () => {
  const inputPatterns = [
    '123',
    '123/45',
    '252/45/14',
    '252/45/14/7',
    '10/2/3/4/5',
    '123/5A',
    '',
    '/',
    '  252 / 45 / 14 / 7  ',
  ];

  it('parses 100,000 varied addresses without panicking', () => {
    const results: ReturnType<typeof parseVietnamHouseNumber>[] = [];
    for (let i = 0; i < 100_000; i++) {
      const input = inputPatterns[i % inputPatterns.length];
      results.push(parseVietnamHouseNumber(input));
    }
    expect(results).toHaveLength(100_000);
    // Spot-check: index 1 maps to pattern '123/45'
    expect(results[1]).toMatchObject({ mainNumber: '123', houseNumber: '45' });
    // index 3 maps to pattern '252/45/14/7'
    expect(results[3]).toMatchObject({ mainNumber: '252', alleys: ['45', '14'], houseNumber: '7' });
  });

  it('all results have the required shape', () => {
    for (let i = 0; i < 1000; i++) {
      const input = inputPatterns[i % inputPatterns.length];
      const result = parseVietnamHouseNumber(input);
      expect(result).toHaveProperty('mainNumber');
      expect(result).toHaveProperty('alleys');
      expect(result).toHaveProperty('houseNumber');
      expect(result).toHaveProperty('original');
      expect(Array.isArray(result.alleys)).toBe(true);
    }
  });

  it('parse + format round-trips correctly under load (10k iterations)', () => {
    const validInputs = inputPatterns.filter(
      (p) => p.trim() !== '' && p.trim() !== '/'
    );
    for (let i = 0; i < 10_000; i++) {
      const input = validInputs[i % validInputs.length];
      const parsed = parseVietnamHouseNumber(input);
      const formatted = formatVietnamHouseNumber(parsed);
      const reparsed = parseVietnamHouseNumber(formatted);
      expect(reparsed.mainNumber).toBe(parsed.mainNumber);
      expect(reparsed.alleys).toEqual(parsed.alleys);
      expect(reparsed.houseNumber).toBe(parsed.houseNumber);
    }
  });
});

// ── Throughput: assert 1,000 parses in under 10ms ────────────────────────────

describe('parseVietnamHouseNumber — throughput assertion', () => {
  it('parses 1,000 addresses in under 10ms', () => {
    const inputs = Array.from(
      { length: 1000 },
      (_, i) => `${100 + i}/${i % 50}/${i % 10}`
    );
    const start = Date.now();
    for (const input of inputs) {
      parseVietnamHouseNumber(input);
    }
    const elapsed = Date.now() - start;
    // In practice this should be <<1ms; 10ms is a very conservative upper bound
    expect(elapsed).toBeLessThan(10);
  });
});
