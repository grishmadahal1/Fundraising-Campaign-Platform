import pino from 'pino';
import { env } from '@/config/env';

export const logger = pino({
  level: env.app.environment === 'production' ? 'info' : 'debug',
  transport:
    env.app.environment === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

/**
 * Create a child logger scoped to a domain.
 * Usage: const log = createLogger('user.service');
 */
export function createLogger(name: string) {
  return logger.child({ module: name });
}
