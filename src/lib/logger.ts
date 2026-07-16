/**
 * Logger estructurado mínimo (sin console.log). Emite una línea JSON por evento
 * a stdout, apta para ingestión por agregadores de logs.
 */
type LogLevel = 'info' | 'warn' | 'error';

function write(level: LogLevel, event: string, data?: Record<string, unknown>): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...data,
  };
  process.stdout.write(`${JSON.stringify(entry)}\n`);
}

export const logger = {
  info: (event: string, data?: Record<string, unknown>) => write('info', event, data),
  warn: (event: string, data?: Record<string, unknown>) => write('warn', event, data),
  error: (event: string, data?: Record<string, unknown>) => write('error', event, data),
};
