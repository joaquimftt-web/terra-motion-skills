import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { auditPublication } from './check-publication-ready.mjs';

const sources = [
  'apps/showcase/public/identity/terra-commerce-original.png',
  'apps/showcase/src/prototype/assets/terra-material-reference.png',
];
function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'terra-rights-test-'));
  try {
    mkdirSync(join(root, 'docs'), { recursive: true });
    writeFileSync(join(root, 'ASSET_NOTICES.md'), 'Fixture notice');
    writeFileSync(
      join(root, 'docs/permission.md'),
      'Test-only permission fixture, not a real authorization',
    );
    const assets = sources.map((source, index) => {
      mkdirSync(join(root, source, '..'), { recursive: true });
      const bytes = Buffer.from('fixture' + index);
      writeFileSync(join(root, source), bytes);
      return {
        source,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        distribution: {
          status: 'approved',
          holder: 'Fixture holder',
          terms: 'Fixture permission',
          evidence: 'docs/permission.md',
        },
      };
    });
    const optimized = 'apps/showcase/src/prototype/assets/terra-material-reference.webp';
    writeFileSync(join(root, optimized), 'fixture optimized');
    assets[1].derivatives = [
      { source: optimized, sha256: createHash('sha256').update('fixture optimized').digest('hex') },
    ];
    run(root, { schemaVersion: 1, assets });
  } finally {
    assert.ok(root.startsWith(join(tmpdir(), 'terra-rights-test-')));
    rmSync(root, { recursive: true, force: true });
  }
}
test('blocks unconfirmed distribution even when code is MIT', () =>
  fixture((root, registry) => {
    registry.assets[0].distribution.status = 'unconfirmed';
    assert.equal(auditPublication(root, registry).ready, false);
  }));
test('requires both identity images, without duplicate or missing entries', () =>
  fixture((root, registry) => {
    registry.assets.pop();
    assert.equal(auditPublication(root, registry).ready, false);
    registry.assets.push(registry.assets[0]);
    assert.equal(auditPublication(root, registry).ready, false);
  }));
test('requires current bytes and records of terms, holder and permission', () =>
  fixture((root, registry) => {
    assert.equal(auditPublication(root, registry).ready, true);
    registry.assets[0].sha256 = '0'.repeat(64);
    assert.equal(auditPublication(root, registry).ready, false);
  }));
test('rejects missing permission evidence and path traversal', () =>
  fixture((root, registry) => {
    registry.assets[0].distribution.evidence = 'docs/missing.md';
    assert.equal(auditPublication(root, registry).ready, false);
    registry.assets[0].distribution.evidence = '../permission.md';
    assert.equal(auditPublication(root, registry).ready, false);
  }));
test('requires a separate asset notice', () =>
  fixture((root, registry) => {
    rmSync(join(root, 'ASSET_NOTICES.md'));
    assert.equal(auditPublication(root, registry).ready, false);
  }));

test('permission evidence must be a non-empty regular file, not a directory', () =>
  fixture((root, registry) => {
    registry.assets[0].distribution.evidence = 'docs/';
    assert.equal(auditPublication(root, registry).ready, false);
    writeFileSync(join(root, 'docs/empty.md'), '');
    registry.assets[0].distribution.evidence = 'docs/empty.md';
    assert.equal(auditPublication(root, registry).ready, false);
  }));
test('requires the optimized derivative provenance and exact checksum when present', () =>
  fixture((root, registry) => {
    const source = 'apps/showcase/src/prototype/assets/terra-material-reference.webp';
    writeFileSync(join(root, source), 'fixture optimized');
    delete registry.assets[1].derivatives;
    assert.equal(auditPublication(root, registry).ready, false);
    registry.assets[1].derivatives = [
      { source, sha256: createHash('sha256').update('fixture optimized').digest('hex') },
    ];
    assert.equal(auditPublication(root, registry).ready, true);
    registry.assets[1].derivatives[0].sha256 = '0'.repeat(64);
    assert.equal(auditPublication(root, registry).ready, false);
  }));

test('separate notice must be a non-empty regular file', () =>
  fixture((root, registry) => {
    writeFileSync(join(root, 'ASSET_NOTICES.md'), '   ');
    assert.equal(auditPublication(root, registry).ready, false);
    rmSync(join(root, 'ASSET_NOTICES.md'));
    mkdirSync(join(root, 'ASSET_NOTICES.md'));
    assert.equal(auditPublication(root, registry).ready, false);
  }));

test('an absent optimized material and provenance cannot silently pass', () =>
  fixture((root, registry) => {
    rmSync(join(root, 'apps/showcase/src/prototype/assets/terra-material-reference.webp'));
    delete registry.assets[1].derivatives;
    assert.equal(auditPublication(root, registry).ready, false);
  }));

test('source directories are rejected as blockers without throwing', () =>
  fixture((root, registry) => {
    rmSync(join(root, sources[0]));
    mkdirSync(join(root, sources[0]));
    assert.equal(auditPublication(root, registry).ready, false);
  }));

test('evidence through a directory junction outside docs is rejected', () =>
  fixture((root, registry) => {
    mkdirSync(join(root, 'outside'));
    writeFileSync(join(root, 'outside/permission.md'), 'Fixture only');
    symlinkSync(join(root, 'outside'), join(root, 'docs/linked'), 'junction');
    registry.assets[0].distribution.evidence = 'docs/linked/permission.md';
    assert.equal(auditPublication(root, registry).ready, false);
  }));
