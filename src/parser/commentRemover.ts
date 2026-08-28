import { getLanguageSyntax, LanguageCommentSyntax } from './languageConfigs';

export interface CommentRemoverOptions {
  preserveShebang?: boolean;
  preserveDirectives?: boolean;
  collapseEmptyLines?: boolean;
}

const DEFAULT_OPTIONS: CommentRemoverOptions = {
  preserveShebang: true,
  preserveDirectives: false,
  collapseEmptyLines: true,
};

const DIRECTIVE_PATTERNS = [
  'eslint-disable',
  'eslint-enable',
  '@ts-ignore',
  '@ts-expect-error',
  '@ts-nocheck',
  'prettier-ignore',
  'istanbul ignore',
  '@nolint',
  'nolint',
  'fmt: skip',
  'fmt: off',
  'fmt: on',
  'cstyle off',
  'cstyle on',
];

function isDirectiveComment(commentText: string): boolean {
  const lower = commentText.toLowerCase();
  return DIRECTIVE_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Removes comments from the provided source code according to language rules.
 */
export function removeComments(
  code: string,
  languageId: string,
  options: CommentRemoverOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const syntax: LanguageCommentSyntax = getLanguageSyntax(languageId);

  if (!code) {
    return '';
  }

  // Handle Shebang at start of file
  let shebangHeader = '';
  let restCode = code;
  if (code.startsWith('#!')) {
    const firstNewline = code.indexOf('\n');
    if (firstNewline !== -1) {
      const line = code.slice(0, firstNewline + 1);
      if (opts.preserveShebang) {
        shebangHeader = line;
      }
      restCode = code.slice(firstNewline + 1);
    } else {
      if (opts.preserveShebang) {
        return code;
      }
      restCode = '';
    }
  }

  const resultChars: string[] = [];
  let i = 0;
  const len = restCode.length;

  let inString: string | null = null; // "'", '"', '`'
  let isEscaped = false;
  let inSingleLineComment = false;
  let activeSingleLinePrefix = '';
  let currentCommentBuffer = '';

  let inBlockComment: { start: string; end: string } | null = null;

  // Helper to check if string starting at `i` matches `target`
  const startsWithAt = (str: string, target: string, index: number): boolean => {
    return str.startsWith(target, index);
  };

  while (i < len) {
    const char = restCode[i];
    const nextChar = i + 1 < len ? restCode[i + 1] : '';

    // If currently inside a single-line comment
    if (inSingleLineComment) {
      if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        if (opts.preserveDirectives && isDirectiveComment(currentCommentBuffer)) {
          resultChars.push(activeSingleLinePrefix + currentCommentBuffer);
        }
        inSingleLineComment = false;
        activeSingleLinePrefix = '';
        currentCommentBuffer = '';
        // Keep the newline character
        resultChars.push(char);
      } else {
        currentCommentBuffer += char;
      }
      i++;
      continue;
    }

    // If currently inside a block comment
    if (inBlockComment) {
      const endMatch = startsWithAt(restCode, inBlockComment.end, i);
      if (endMatch) {
        if (opts.preserveDirectives && isDirectiveComment(currentCommentBuffer)) {
          resultChars.push(inBlockComment.start + currentCommentBuffer + inBlockComment.end);
        }
        i += inBlockComment.end.length;
        inBlockComment = null;
        currentCommentBuffer = '';
        continue;
      } else {
        currentCommentBuffer += char;
        i++;
        continue;
      }
    }

    // Handle string literals escaping
    if (inString) {
      resultChars.push(char);
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    // Check for string literal entry (single quote, double quote, backtick)
    if (char === "'" || char === '"' || char === '`') {
      inString = char;
      isEscaped = false;
      resultChars.push(char);
      i++;
      continue;
    }

    // Check for Block Comment start
    let matchedBlockStart: { start: string; end: string } | null = null;
    for (const blockRule of syntax.block) {
      if (startsWithAt(restCode, blockRule.start, i)) {
        matchedBlockStart = blockRule;
        break;
      }
    }

    if (matchedBlockStart) {
      inBlockComment = matchedBlockStart;
      currentCommentBuffer = '';
      i += matchedBlockStart.start.length;
      continue;
    }

    // Check for Single-Line Comment start
    let matchedSinglePrefix: string | null = null;
    for (const singlePrefix of syntax.singleLine) {
      if (startsWithAt(restCode, singlePrefix, i)) {
        matchedSinglePrefix = singlePrefix;
        break;
      }
    }

    if (matchedSinglePrefix) {
      inSingleLineComment = true;
      activeSingleLinePrefix = matchedSinglePrefix;
      currentCommentBuffer = '';
      i += matchedSinglePrefix.length;
      continue;
    }

    // Normal code character
    resultChars.push(char);
    i++;
  }

  // Handle unclosed single-line comment at EOF
  if (inSingleLineComment && opts.preserveDirectives && isDirectiveComment(currentCommentBuffer)) {
    resultChars.push(activeSingleLinePrefix + currentCommentBuffer);
  }

  let cleanedCode = shebangHeader + resultChars.join('');

  // Trim trailing whitespace per line and collapse empty lines created by comment removals
  const lines = cleanedCode.split(/\r?\n/);
  const originalLines = code.split(/\r?\n/);

  const outputLines: string[] = [];
  for (let l = 0; l < lines.length; l++) {
    let line = lines[l];
    const origLine = originalLines[l] ?? '';

    // Trim trailing whitespace left behind by inline comments
    line = line.trimEnd();

    // If line became empty/whitespace-only, but original line was non-empty comment
    if (opts.collapseEmptyLines && line === '' && origLine.trim() !== '') {
      // Skip adding blank line created solely by comment removal
      continue;
    }
    outputLines.push(line);
  }
  cleanedCode = outputLines.join('\n');

  return cleanedCode;
}
