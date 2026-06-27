import { bench, describe } from 'vitest';
import { parseVietnamHouseNumber, formatVietnamHouseNumber } from './address';

describe('parseVietnamHouseNumber Benchmark', () => {
  bench('simple number', () => {
    parseVietnamHouseNumber('123');
  });

  bench('single alley', () => {
    parseVietnamHouseNumber('123/45');
  });

  bench('deep alley hierarchy (3 levels)', () => {
    parseVietnamHouseNumber('252/45/14/7');
  });

  bench('very deep alley (5 levels)', () => {
    parseVietnamHouseNumber('10/2/3/4/5');
  });

  bench('with inner whitespaces', () => {
    parseVietnamHouseNumber('  252 / 45 / 14 / 7  ');
  });

  bench('alphanumeric suffix', () => {
    parseVietnamHouseNumber('123/5A');
  });

  bench('empty string (edge case)', () => {
    parseVietnamHouseNumber('');
  });

  bench('bare slash (edge case)', () => {
    parseVietnamHouseNumber('/');
  });
});

describe('formatVietnamHouseNumber Benchmark', () => {
  bench('format simple number', () => {
    formatVietnamHouseNumber({ mainNumber: '123', alleys: [], houseNumber: '123', original: '123' });
  });

  bench('format single alley', () => {
    formatVietnamHouseNumber({ mainNumber: '123', alleys: [], houseNumber: '45', original: '123/45' });
  });

  bench('format deep alley', () => {
    formatVietnamHouseNumber({ mainNumber: '252', alleys: ['45', '14'], houseNumber: '7', original: '252/45/14/7' });
  });
});

describe('Round-trip Benchmark (parse + format)', () => {
  bench('parse then format: single alley', () => {
    formatVietnamHouseNumber(parseVietnamHouseNumber('123/45'));
  });

  bench('parse then format: deep alley', () => {
    formatVietnamHouseNumber(parseVietnamHouseNumber('252/45/14/7'));
  });
});
