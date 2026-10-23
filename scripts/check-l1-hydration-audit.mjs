import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
const script = resolve('scripts/check-l1-consumer.mjs');
const positive = spawnSync(process.execPath, [script], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});
process.stdout.write(positive.stdout);
if (positive.status !== 0) {
  process.stderr.write(positive.stderr);
  throw new Error('Positive independent consumer failed');
}
// Generated latest-run observation only; never accept a stale negative result.
rmSync('.validation/l1-hydration-negative-observation.json', { force: true });
const negative = spawnSync(process.execPath, [script, '--inject-late-recoverable'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});
const observation = JSON.parse(
  readFileSync('.validation/l1-hydration-negative-observation.json', 'utf8'),
);
assert.equal(observation.rootCommitted, true);
assert.equal(observation.boundaryCommitted, true);
assert.ok(
  observation.errors.length > 0,
  'Negative control must trigger the actual React onRecoverableError callback after interactions',
);
assert.notEqual(
  negative.status,
  0,
  'Late recoverable hydration errors must reject the consumer; an early clean snapshot is not enough',
);
assert.equal(
  negative.status,
  1,
  'Expected the assertion failure exit, not a signal or startup failure',
);
assert.match(
  negative.stderr,
  /RECOVERABLE_HYDRATION_ERROR/,
  'Reject specifically for hydration, not an unrelated process failure',
);
writeFileSync(
  '.validation/l1-hydration-audit.json',
  JSON.stringify(
    {
      passed: true,
      positive: { exit: positive.status },
      negative: {
        exit: negative.status,
        actualReactRecoverableErrors: observation.errors.length,
        checkpoint: observation.phase,
      },
      limit:
        'Scenario-bounded checks at explicit commits and interactions; not proof of absence for arbitrary future asynchronous work.',
    },
    null,
    2,
  ),
);
console.log(
  'PASS hydration audit: healthy late boundary accepted; real late recoverable mismatch rejected after application interactions',
);
