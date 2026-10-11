export interface DiffPart {
  type: 'equal' | 'insert' | 'delete';
  value: string;
}

/**
 * Computes a word-and-space level diff between two strings using Longest Common Subsequence.
 */
export function computeWordDiff(original: string, rewritten: string): DiffPart[] {
  // Tokenize preserving spaces and punctuation
  const tokenize = (str: string) => {
    return str.match(/[\w'-]+|[^\w\s]+|\s+/g) || [];
  };

  const origTokens = tokenize(original);
  const rewTokens = tokenize(rewritten);

  const n = origTokens.length;
  const m = rewTokens.length;

  // For very long texts, limit matrix size to prevent high memory usage
  if (n * m > 250000) {
    return [
      { type: 'delete', value: original },
      { type: 'insert', value: rewritten }
    ];
  }

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1) as any);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origTokens[i] === rewTokens[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to extract diff
  let i = n;
  let j = m;
  const rawParts: DiffPart[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origTokens[i - 1] === rewTokens[j - 1]) {
      rawParts.push({ type: 'equal', value: origTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawParts.push({ type: 'insert', value: rewTokens[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawParts.push({ type: 'delete', value: origTokens[i - 1] });
      i--;
    }
  }

  rawParts.reverse();

  // Consolidate adjacent tokens of same diff type
  const consolidated: DiffPart[] = [];
  for (const part of rawParts) {
    if (consolidated.length > 0 && consolidated[consolidated.length - 1].type === part.type) {
      consolidated[consolidated.length - 1].value += part.value;
    } else {
      consolidated.push({ ...part });
    }
  }

  return consolidated;
}
