import pino from 'pino';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (object: Record<string, unknown>) => {
      if (!object.err) return object;

      const { err, ...rest } = object;
      const serialized =
        err instanceof Error
          ? pino.stdSerializers.err(err)
          : (err as { stack?: string; type?: string; message?: string });

      return {
        ...rest,
        stack_trace: serialized.stack,
        type: serialized.type,
        error_message: serialized.message,
      };
    },
  },
});
export const logInfo = (message: string, error?: unknown, callid?: string) => {
  const logObject = createLogObject(error, callid);

  logger.info(logObject, message);
};
export const logWarning = (
  message: string,
  error?: unknown,
  callid?: string,
) => {
  const logObject = createLogObject(error, callid);

  logger.warn(logObject, message);
};
export const logError = (message: string, error?: unknown, callid?: string) => {
  const logObject = createLogObject(error, callid);

  logger.error(logObject, message);
};
const createLogObject = (error?: unknown, callid?: string) => {
  const navCallid = callid ? { 'Nav-CallId': callid } : {};
  const err = error ? { err: error } : {};

  return {
    ...navCallid,
    ...err,
  };
};
