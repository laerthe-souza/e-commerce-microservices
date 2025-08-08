import { ZodError, z } from 'zod';

import { IEnvironment } from '@shared/enums/environment.enum';

enum IZodErrors {
  REQUIRED = 'Required variable',
  INVALID_URL = 'Invalid url',
  INVALID_EMAIL = 'Invalid email',
}

const environments = Object.values(IEnvironment) as unknown as readonly [
  IEnvironment,
  ...IEnvironment[],
];

const envVariablesSchema = z.object({
  API_KEY: z.string({ required_error: IZodErrors.REQUIRED }),
  NODE_ENV: z.enum(environments, {
    required_error: IZodErrors.REQUIRED,
  }),
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
  AWS_ACCESS_KEY_ID: z.string({ required_error: IZodErrors.REQUIRED }),
  AWS_SECRET_ACCESS_KEY: z.string({ required_error: IZodErrors.REQUIRED }),
  AWS_REGION: z.string({ required_error: IZodErrors.REQUIRED }),
  SOURCE_EMAIL: z
    .string({ required_error: IZodErrors.REQUIRED })
    .email(IZodErrors.INVALID_EMAIL),
  RECIPIENT_EMAIL: z
    .string({ required_error: IZodErrors.REQUIRED })
    .email(IZodErrors.INVALID_EMAIL),
});

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

      throw new Error(`\n\n${formattedErrors.join('\n')}\n`);
    } else {
      throw error;
    }
  }
}

export type IEnvVariables = z.output<typeof envVariablesSchema>;
