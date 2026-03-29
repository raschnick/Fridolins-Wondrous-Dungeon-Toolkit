const test = require("node:test");
const assert = require("node:assert/strict");

const { buildLogPayload, createLogger, serializeError } = require("../src/logger");

function createMemoryStream() {
  const chunks = [];
  return {
    chunks,
    write(chunk) {
      chunks.push(String(chunk));
      return true;
    }
  };
}

test("buildLogPayload includes an ISO timestamp, level, message, and metadata", () => {
  const payload = buildLogPayload(
    "info",
    "HTTP server listening.",
    { port: 3000, pid: 1234 },
    () => new Date("2026-03-29T10:11:12.345Z")
  );

  assert.deepEqual(payload, {
    timestamp: "2026-03-29T10:11:12.345Z",
    level: "info",
    message: "HTTP server listening.",
    port: 3000,
    pid: 1234
  });
});

test("createLogger writes info logs to stdout and serializes errors to stderr", () => {
  const stdout = createMemoryStream();
  const stderr = createMemoryStream();
  const logger = createLogger({
    stdout,
    stderr,
    now: () => new Date("2026-03-29T10:11:12.345Z")
  });

  logger.info("Starting Fridolins Wondrous Dungeon Toolkit.", {
    port: 3000
  });
  logger.error("HTTP server error.", {
    error: new Error("boom")
  });

  assert.equal(stdout.chunks.length, 1);
  assert.equal(stderr.chunks.length, 1);

  const infoEntry = JSON.parse(stdout.chunks[0]);
  assert.equal(infoEntry.timestamp, "2026-03-29T10:11:12.345Z");
  assert.equal(infoEntry.level, "info");
  assert.equal(infoEntry.message, "Starting Fridolins Wondrous Dungeon Toolkit.");
  assert.equal(infoEntry.port, 3000);

  const errorEntry = JSON.parse(stderr.chunks[0]);
  assert.equal(errorEntry.timestamp, "2026-03-29T10:11:12.345Z");
  assert.equal(errorEntry.level, "error");
  assert.equal(errorEntry.message, "HTTP server error.");
  assert.equal(errorEntry.error.name, "Error");
  assert.equal(errorEntry.error.message, "boom");
  assert.match(errorEntry.error.stack, /Error: boom/);
});

test("serializeError preserves nested causes", () => {
  const root = new Error("root cause");
  const wrapped = new Error("top level");
  wrapped.cause = root;

  assert.deepEqual(serializeError(wrapped), {
    name: "Error",
    message: "top level",
    stack: wrapped.stack,
    cause: {
      name: "Error",
      message: "root cause",
      stack: root.stack
    }
  });
});
