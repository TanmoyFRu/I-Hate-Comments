# I Hate Comments (Smart Comment Remover)

A fast, deterministic, language-aware VS Code extension that removes single-line and multi-line comments from selected code snippets or entire files without using AI.

## ✨ Features

- **Context Menu Integration**: Right-click on any selection or open document and choose **Remove Comments**.
- **30+ Language Support**: Handles JavaScript, TypeScript, Python, HTML, C, C++, Java, C#, Go, Rust, PHP, SQL, Ruby, Lua, Shell, Haskell, YAML, and more.
- **String & URL Safe**: Character-level state machine guarantees that `#`, `//`, or `/*` inside string literals (`"https://..."`) are **never** deleted.
- **Shebang & Directives Preservation**: Configurable settings to preserve `#!/usr/bin/env` shebangs and linter directives (`eslint-disable`, `@ts-ignore`).

## 🚀 How to Use

1. Highlight code in VS Code (or leave nothing selected to process the full file).
2. Right-click and select **Remove Comments** (or press `Ctrl+Shift+P` -> type `Remove Comments`).

## ⚙️ Extension Settings

- `smartCommentRemover.preserveShebang`: Keep shebang lines at the top of files. (default: `true`)
- `smartCommentRemover.preserveDirectives`: Keep linter/compiler directives like `eslint-disable` or `@ts-ignore`. (default: `false`)
- `smartCommentRemover.collapseEmptyLines`: Remove empty lines created by removing comments. (default: `true`)

## 🛠️ Development & Building

```bash
# Clone the repository
git clone https://github.com/TanmoyFRu/I-Hate-Comments.git
cd I-Hate-Comments

# Install dependencies
npm install

# Run unit tests
npm test

# Compile TypeScript
npm run compile
```

## 📜 License

MIT
