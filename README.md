<p align="center">
  <img src="./Untitled design.png" width="300" alt="I Hate Comments Header" style="border: 2px solid #ffffff; padding: 8px; background: #000000; border-radius: 12px;">
</p>

<h1 align="center">I Hate Comments</h1>

<p align="center">
  <b>Because your code should explain itself, and comments are just essays written by developers who love typing.</b>
</p>

---

## Why This Exists

- **Comments Lie**: Code changes, comments stay outdated for eternity.
- **Save Bandwidth**: Why transmit 500 lines of developer diary entries to production?
- **AI Is Overkill**: You do not need a massive language model just to delete <code>// TODO: fix this later</code>.
- **Pure Syntax Engine**: Strips comments deterministically without touching URLs, strings, or shebangs.

---

## What It Does

- **One-Click Purge**: Right-click any selection or document and select <b>Remove Comments</b>.
- **30+ Language Rules**: Full support for JavaScript, TypeScript, Python, HTML, CSS, C/C++, Java, Go, Rust, PHP, SQL, Lua, Shell, and more.
- **String & URL Safe**: Advanced state-machine parser guarantees strings like <code>"https://example.com#section"</code> are never ruined.
- **Directive Aware**: Option to keep critical linter rules (like <code>eslint-disable</code> or <code>@ts-ignore</code>) while erasing everything else.

---

## Quick Usage

1. Open any file in VS Code.
2. Select a block of code (or leave unselected to process the whole file).
3. Right-click anywhere and choose <b>Remove Comments</b>.
4. Watch the fluff disappear.

---

## Configuration

Custom options accessible via VS Code Settings:

| Setting Key | Default | Description |
|---|---|---|
| <code>smartCommentRemover.preserveShebang</code> | <code>true</code> | Keeps top shebang lines like <code>#!/usr/bin/env node</code> intact |
| <code>smartCommentRemover.preserveDirectives</code> | <code>false</code> | Preserves linter/compiler flags like <code>eslint-disable</code> |
| <code>smartCommentRemover.collapseEmptyLines</code> | <code>true</code> | Collapses blank lines created by comment removal |

---

## Local Development

```bash
git clone https://github.com/TanmoyFRu/I-Hate-Comments.git
cd I-Hate-Comments
npm install
npm run compile
npm test
```

---

## License

MIT
