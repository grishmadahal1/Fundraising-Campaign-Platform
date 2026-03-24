import pino from 'pino';
import { env } from '@/config/env';

const isDev = env.app.environment === 'development';

/**
 * Pino logger instance.
 * In development: human-readable formatted output (no worker threads).
 * In production: structured JSON for log aggregation.
 */
export const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
});

/**
 * Create a child logger scoped to a domain.
 * Usage: const log = createLogger('user.service');
 */
export function createLogger(name: string) {
  return logger.child({ module: name });
}
