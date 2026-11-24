import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: one line, a code review comment that approves a pull
// request while carrying quiet existential dread.
const LINE =
  "LGTM. The code works, the tests pass, and somewhere a future version of me is already apologizing for this merge.";

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

const line = LINE;
if (line.length === 0) fail("the line is empty");
if (line.length > 140)
  fail(`the line is ${line.length} characters, over the 140 limit`);
if (line.includes("\n") || line.includes("\r"))
  fail("the line must be a single line");
if (line.trim().length === 0) fail("the line must not be only whitespace");
if (!/^[\x20-\x7E]+$/.test(line))
  fail("the line must be printable ASCII");
const words = line.split(/\s+/).filter(Boolean);
if (words.length < 3) fail("the line needs at least 3 words");
// The judge's first criterion: the comment must actually approve the
// pull request, and carry quiet dread. Check both are present so a
// future edit cannot silently drop the approval or the dread.
const approvals = ["lgtm", "approved", "approve", "ship it", "good to go"];
const lowered = line.toLowerCase();
if (!approvals.some((a) => lowered.includes(a)))
  fail("the line must approve the pull request");
const dread = ["apologizing", "dread", "regret", "sorry", "doom", "haunt"];
if (!dread.some((d) => lowered.includes(d)))
  fail("the line must carry quiet dread");
// Byte length, not just character length: the gate counts the file.
if (new TextEncoder().encode(line).length > 140)
  fail("the line is over 140 bytes");

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== line) fail("round-trip check failed: entry.txt differs");
console.log(
  `entry.txt OK: ${line.length} characters, ${words.length} words, written to /output/entry.txt`,
);
