import { Logger } from '@nestjs/common';
import { ZodError, z } from 'zod';

import { IEnvironment } from '@shared/enums/environment.enum';

enum IZodErrors {
  REQUIRED = 'Required variable',
  INVALID_URL = 'Invalid url',
}

const environments = Object.values(IEnvironment) as unknown as readonly [
  IEnvironment,
  ...IEnvironment[],
];

export const envVariablesSchema = z.object({
  API_KEY: z.string({ required_error: IZodErrors.REQUIRED }),
  NODE_ENV: z.enum(environments, {
    required_error: IZodErrors.REQUIRED,
  }),
  ENCRYPTION_KEY: z.string({ required_error: IZodErrors.REQUIRED }),
  DATABASE_URL: z.string({ required_error: IZodErrors.REQUIRED }),
  DIRECT_DATABASE_URL: z.string({ required_error: IZodErrors.REQUIRED }),
  HOST_URL: z
    .string({ required_error: IZodErrors.REQUIRED })
    .url(IZodErrors.INVALID_URL),
  PORT: z.string({ required_error: IZodErrors.REQUIRED }),
  RABBITMQ_API_URL: z
    .string({ required_error: IZodErrors.REQUIRED })
    .url(IZodErrors.INVALID_URL),
  RABBITMQ_URI: z.string({ required_error: IZodErrors.REQUIRED }),
  RABBITMQ_VHOST: z.string({ required_error: IZodErrors.REQUIRED }),
  OTEL_COLLECTOR_URL: z
    .string({ required_error: IZodErrors.REQUIRED })
    .url(IZodErrors.INVALID_URL),
  SERVICE_NAME: z.string({ required_error: IZodErrors.REQUIRED }),
});

const logger = new Logger(validateEnvVariables.name);

export function validateEnvVariables(
  config: Record<string, string | number | boolean>,
) {
  try {
    const parsedEnv = envVariablesSchema.parse(config);

    globalThis.myEnv = parsedEnv;

    return parsedEnv;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(
        data => `Env variable ${data.path[0]} error - ${data.message}`,
      );

      logger.error(`\n\n${formattedErrors.join('\n')}\n`);
    } else {
      logger.error(error.message);
    }

    throw error;
  }
}

export type IEnvVariables = z.output<typeof envVariablesSchema>;
