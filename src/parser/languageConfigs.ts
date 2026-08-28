export interface BlockCommentRule {
  start: string;
  end: string;
}

export interface LanguageCommentSyntax {
  singleLine: string[];
  block: BlockCommentRule[];
  docstring?: BlockCommentRule[];
}

// C-style comments: // and /* */
const C_STYLE: LanguageCommentSyntax = {
  singleLine: ['//'],
  block: [{ start: '/*', end: '*/' }],
};

// Hash-style comments: #
const HASH_STYLE: LanguageCommentSyntax = {
  singleLine: ['#'],
  block: [],
};

// Python: # and docstrings (""" or ''')
const PYTHON_STYLE: LanguageCommentSyntax = {
  singleLine: ['#'],
  block: [],
  docstring: [
    { start: '"""', end: '"""' },
    { start: "'''", end: "'''" },
  ],
};

// HTML / XML style: <!-- -->
const HTML_STYLE: LanguageCommentSyntax = {
  singleLine: [],
  block: [{ start: '<!--', end: '-->' }],
};

// SQL style: -- and /* */
const SQL_STYLE: LanguageCommentSyntax = {
  singleLine: ['--'],
  block: [{ start: '/*', end: '*/' }],
};

// Lua style: -- and --[[ ]]
const LUA_STYLE: LanguageCommentSyntax = {
  singleLine: ['--'],
  block: [{ start: '--[[', end: ']]' }],
};

// Haskell style: -- and {- -}
const HASKELL_STYLE: LanguageCommentSyntax = {
  singleLine: ['--'],
  block: [{ start: '{-', end: '-}' }],
};

// INI / Lisp style: ;
const SEMICOLON_STYLE: LanguageCommentSyntax = {
  singleLine: [';'],
  block: [],
};

// MATLAB / TeX style: %
const PERCENT_STYLE: LanguageCommentSyntax = {
  singleLine: ['%'],
  block: [],
};

// Fortran style: !
const FORTRAN_STYLE: LanguageCommentSyntax = {
  singleLine: ['!'],
  block: [],
};

// Ruby style: # and =begin =end
const RUBY_STYLE: LanguageCommentSyntax = {
  singleLine: ['#'],
  block: [{ start: '=begin', end: '=end' }],
};

// Map of VS Code language IDs to syntax rules
const LANGUAGE_SYNTAX_MAP: Record<string, LanguageCommentSyntax> = {
  // C-style languages
  javascript: C_STYLE,
  typescript: C_STYLE,
  javascriptreact: C_STYLE,
  typescriptreact: C_STYLE,
  c: C_STYLE,
  cpp: C_STYLE,
  csharp: C_STYLE,
  java: C_STYLE,
  go: C_STYLE,
  rust: C_STYLE,
  swift: C_STYLE,
  kotlin: C_STYLE,
  dart: C_STYLE,
  php: C_STYLE,
  css: C_STYLE,
  scss: C_STYLE,
  less: C_STYLE,
  jsonc: C_STYLE,
  groovy: C_STYLE,
  scala: C_STYLE,
  'objective-c': C_STYLE,
  'objective-cpp': C_STYLE,

  // Hash-style languages
  python: PYTHON_STYLE,
  ruby: RUBY_STYLE,
  shellscript: HASH_STYLE,
  bash: HASH_STYLE,
  sh: HASH_STYLE,
  zsh: HASH_STYLE,
  yaml: HASH_STYLE,
  toml: HASH_STYLE,
  dockerfile: HASH_STYLE,
  r: HASH_STYLE,
  elixir: HASH_STYLE,
  perl: HASH_STYLE,
  powershell: { singleLine: ['#'], block: [{ start: '<#', end: '#>' }] },
  makefile: HASH_STYLE,
  graphql: HASH_STYLE,
  nim: HASH_STYLE,

  // HTML/Markup
  html: HTML_STYLE,
  xml: HTML_STYLE,
  vue: HTML_STYLE,
  svelte: HTML_STYLE,
  markdown: HTML_STYLE,
  xhtml: HTML_STYLE,
  svg: HTML_STYLE,

  // SQL & Dash-style
  sql: SQL_STYLE,
  plsql: SQL_STYLE,
  lua: LUA_STYLE,
  haskell: HASKELL_STYLE,
  ada: { singleLine: ['--'], block: [] },

  // Semicolon-style
  ini: SEMICOLON_STYLE,
  properties: SEMICOLON_STYLE,
  clojure: SEMICOLON_STYLE,
  lisp: SEMICOLON_STYLE,
  scheme: SEMICOLON_STYLE,
  assembly: SEMICOLON_STYLE,

  // Percent-style
  matlab: PERCENT_STYLE,
  erlang: { singleLine: ['%'], block: [] },
  tex: PERCENT_STYLE,
  latex: PERCENT_STYLE,

  // Fortran
  fortran: FORTRAN_STYLE,
};

/**
 * Retrieves comment syntax rules for a given VS Code language ID.
 * Falls back to combining single-line and multi-line comments if language ID is unknown.
 */
export function getLanguageSyntax(languageId: string): LanguageCommentSyntax {
  const normalizedId = (languageId || '').toLowerCase().trim();
  if (LANGUAGE_SYNTAX_MAP[normalizedId]) {
    return LANGUAGE_SYNTAX_MAP[normalizedId];
  }

  // Generic fallback if language is unspecified or unknown
  return {
    singleLine: ['//', '#'],
    block: [
      { start: '/*', end: '*/' },
      { start: '<!--', end: '-->' },
    ],
  };
}
