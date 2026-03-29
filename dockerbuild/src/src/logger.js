function serializeError(error) {
  if (!(error instanceof Error)) {
    return error;
  }

  const payload = {
    name: error.name,
    message: error.message
  };

  if (error.stack) {
    payload.stack = error.stack;
  }

  if (Object.prototype.hasOwnProperty.call(error, "code") && error.code != null) {
    payload.code = error.code;
  }

  if (Object.prototype.hasOwnProperty.call(error, "cause") && error.cause) {
    payload.cause = serializeError(error.cause);
  }

  return payload;
}

function buildLogPayload(level, message, metadata = {}, now = () => new Date()) {
  const base = {
    timestamp: now().toISOString(),
    level,
    message
  };

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {
      ...base,
      data: metadata
    };
  }

  return {
    ...base,
    ...metadata
  };
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value, (_key, entry) => {
      if (entry instanceof Error) {
        return serializeError(entry);
      }
      if (typeof entry === "bigint") {
        return entry.toString();
      }
      return entry;
    });
  } catch (error) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Failed to serialize log payload.",
      serializationError: serializeError(error)
    });
  }
}

function createLogger({ stdout = process.stdout, stderr = process.stderr, now = () => new Date() } = {}) {
  function write(level, message, metadata = {}) {
    const payload = buildLogPayload(level, message, metadata, now);
    const line = `${safeJsonStringify(payload)}\n`;
    const stream = level === "error" || level === "fatal" ? stderr : stdout;
    stream.write(line);
    return payload;
  }

  return {
    info(message, metadata) {
      return write("info", message, metadata);
    },
    warn(message, metadata) {
      return write("warn", message, metadata);
    },
    error(message, metadata) {
      return write("error", message, metadata);
    },
    fatal(message, metadata) {
      return write("fatal", message, metadata);
    }
  };
}

const logger = createLogger();

module.exports = {
  buildLogPayload,
  createLogger,
  logger,
  serializeError
};
