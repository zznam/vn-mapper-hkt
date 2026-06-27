export interface ParsedAddressNumber {
  mainNumber: string;
  alleys: string[];
  houseNumber: string;
  original: string;
}

/**
 * Parses a Vietnamese house number that may contain multiple alley levels.
 *
 * Examples:
 *   "252/45/14/7" -> mainNumber: "252", alleys: ["45", "14"], houseNumber: "7"
 *   "123/45"      -> mainNumber: "123", alleys: [], houseNumber: "45"
 *   "123"         -> mainNumber: "123", alleys: [], houseNumber: "123"
 *
 * Edge cases:
 *   ""    -> mainNumber: "", alleys: [], houseNumber: "", original: ""
 *   "/"   -> mainNumber: "", alleys: [], houseNumber: "", original: "/"
 */
export function parseVietnamHouseNumber(addressPart: string): ParsedAddressNumber {
  const trimmed = addressPart.trim();

  if (!trimmed || !trimmed.includes('/')) {
    return {
      mainNumber: trimmed,
      alleys: [],
      houseNumber: trimmed,
      original: trimmed,
    };
  }

  const parts = trimmed.split('/').map((p) => p.trim());

  // Guard against degenerate inputs like "/" which splits into ["", ""]
  if (parts.every((p) => p === '')) {
    return {
      mainNumber: '',
      alleys: [],
      houseNumber: '',
      original: trimmed,
    };
  }

  const mainNumber = parts[0];
  const houseNumber = parts[parts.length - 1];
  const alleys = parts.slice(1, parts.length - 1);

  return {
    mainNumber,
    alleys,
    houseNumber,
    original: trimmed,
  };
}

/**
 * Formats a ParsedAddressNumber back into a canonical Vietnamese address string.
 * Example: { mainNumber: "252", alleys: ["45", "14"], houseNumber: "7" } -> "252/45/14/7"
 */
export function formatVietnamHouseNumber(parsed: ParsedAddressNumber): string {
  if (parsed.alleys.length === 0) {
    if (parsed.mainNumber === parsed.houseNumber) {
      return parsed.mainNumber;
    }
    return `${parsed.mainNumber}/${parsed.houseNumber}`;
  }
  return [parsed.mainNumber, ...parsed.alleys, parsed.houseNumber].join('/');
}
