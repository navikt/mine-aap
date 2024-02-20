import pino from 'pino';

export const myNewLogger = pino({
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
