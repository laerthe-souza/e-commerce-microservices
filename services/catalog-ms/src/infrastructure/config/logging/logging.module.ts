import { Global, Module } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { LoggerModule } from 'nestjs-pino';

import { IEnvironment } from '@shared/enums/environment.enum';

import { EnvModule } from '../env/env.module';
import { LoggingService } from './logging.service';

@Global()
@Module({
  imports: [
    EnvModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport:
          myEnv.NODE_ENV === IEnvironment.LOCAL
            ? {
                target: 'pino-pretty',
                options: { singleLine: false },
              }
            : undefined,
        formatters: {
          level: label => {
            return { level: label.toUpperCase() };
          },
          bindings: bindings => ({
            pid: bindings.pid,
            host: bindings.hostname,
          }),
        },
        hooks: {
          logMethod(inputArgs, method) {
            const span = trace.getSpan(context.active());
            const traceId = span ? span.spanContext().traceId : null;

            if (traceId) {
              inputArgs[0] = {
                ...(inputArgs[0] as unknown as any),
                traceId,
              };
            }

            method.apply(this, inputArgs);
          },
        },
        level: myEnv.NODE_ENV === IEnvironment.LOCAL ? 'debug' : 'info',
      },
    }),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
