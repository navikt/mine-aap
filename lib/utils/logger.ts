import pino from 'pino';

const myNewLogger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (object: any) => {
      if (object.err) {
        const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
        object.stack_trace = err.stack;
        object.type = err.type;
        object.message = err.message;
        delete object.err;
      }
      return object;
    },
  },
});

export const logInfo = (message: string, error?: unknown, callid?: string) => {
  const navCallid = callid ? { 'Nav-CallId': callid } : {};
  const err = error ? { err: error } : {};

  myNewLogger.info(
    {
      ...navCallid,
      ...err,
    },
    message
  );
};
export const logWarning = (message: string, error?: unknown, callid?: string) => {
  const navCallid = callid ? { 'Nav-CallId': callid } : {};
  const err = error ? { err: error } : {};

  myNewLogger.warn(
    {
      ...navCallid,
      ...err,
    },
    message
  );
};
export const logError = (message: string, error?: unknown, callid?: string) => {
  const navCallid = callid ? { 'Nav-CallId': callid } : {};
  const err = error ? { err: error } : {};

  myNewLogger.error(
    {
      ...navCallid,
      ...err,
    },
    message
  );
};
