import { removeComments } from '../parser/commentRemover';
import * as assert from 'assert';

function runTests() {
  console.log('🧪 Starting Smart Comment Remover Engine Tests...\n');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // Test 1: JavaScript Single-line & Block Comments
  test('JavaScript: remove single line and block comments', () => {
    const input = `
// This is a header comment
const a = 1; // inline comment
/* Block comment
   on multiple lines */
const b = 2;
    `.trim();

    const expected = `
const a = 1;
const b = 2;
    `.trim();

    const result = removeComments(input, 'javascript', { collapseEmptyLines: true });
    assert.strictEqual(result.trim(), expected);
  });

  // Test 2: Preserve URLs and Strings
  test('JavaScript: preserve // and /* inside string literals', () => {
    const input = `
const url = "https://example.com/api?q=//test";
const msg = 'Hello /* world */';
// Real comment to remove
    `.trim();

    const expected = `
const url = "https://example.com/api?q=//test";
const msg = 'Hello /* world */';
    `.trim();

    const result = removeComments(input, 'javascript', { collapseEmptyLines: true });
    assert.strictEqual(result.trim(), expected);
  });

  // Test 3: Python hash comments and Shebang
  test('Python: preserve shebang and strings with #', () => {
    const input = `#!/usr/bin/env python3
# Top comment
val = "Hash # inside string" # Inline comment
# Bottom comment
    `.trim();

    const expected = `#!/usr/bin/env python3
val = "Hash # inside string"
    `.trim();

    const result = removeComments(input, 'python', { preserveShebang: true, collapseEmptyLines: true });
    assert.strictEqual(result.trim(), expected);
  });

  // Test 4: HTML comment removal
  test('HTML: remove <!-- --> and /* */ comments', () => {
    const input = `
/* Container */
<div>
  <!-- Header comment -->
  <h1>Title</h1>
  <style>
    /* CSS comment */
    .container { margin: 0; }
  </style>
</div>
    `.trim();

    const expected = `
<div>
  <h1>Title</h1>
  <style>
    .container { margin: 0; }
  </style>
</div>
    `.trim();

    const result = removeComments(input, 'html', { collapseEmptyLines: true });
    assert.strictEqual(result.trim(), expected);
  });

  // Test 5: Preserve Directives
  test('JavaScript: preserve eslint/typescript directives when requested', () => {
    const input = `
// eslint-disable-next-line
const legacyVar = 10;
// Regular comment to strip
    `.trim();

    const result = removeComments(input, 'javascript', { preserveDirectives: true, collapseEmptyLines: true });
    assert.ok(result.includes('eslint-disable-next-line'));
    assert.ok(!result.includes('Regular comment to strip'));
  });

  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
