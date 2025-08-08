import { SpanStatusCode } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import { IEnvironment } from '@shared/enums/environment.enum';

const COLLECTOR_URL = myEnv.OTEL_COLLECTOR_URL;

const traceExporter = new OTLPTraceExporter({
  url: `${COLLECTOR_URL}/traces`,
});

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: myEnv.SERVICE_NAME,
});

const spanProcessor =
  myEnv.NODE_ENV === IEnvironment.LOCAL
    ? new SimpleSpanProcessor(traceExporter)
    : new BatchSpanProcessor(traceExporter);

export const otelSdk = new NodeSDK({
  traceExporter,
  spanProcessors: [spanProcessor],
  instrumentations: [
    new HttpInstrumentation({
      serverName: myEnv.SERVICE_NAME,
    }),
    new NestInstrumentation(),
    new PinoInstrumentation(),
    new ExpressInstrumentation(),
    new AmqplibInstrumentation({
      publishHook: (span, info) => {
        span.updateName(`Publish in: ${info.routingKey}`);
        span.setAttribute('rabbitmq.publish_time', new Date().toLocaleString());
        span.setAttribute('rabbitmq.exchange', info.exchange);
      },
      publishConfirmHook: span => {
        span.setAttribute(
          'rabbitmq.publish_confirm_time',
          new Date().toLocaleString(),
        );
      },
      consumeHook: (span, consumeInfo) => {
        span.updateName(`Consuming from: ${consumeInfo.msg.fields.routingKey}`);
        span.setAttribute('rabbitmq.consume_time', new Date().toLocaleString());
      },
      consumeEndHook: (span, consumeEndInfo) => {
        if (consumeEndInfo.rejected) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: consumeEndInfo.endOperation,
          });
        } else {
          span.setAttribute('rabbitmq.ack_time', new Date().toLocaleString());
        }
      },
    }),
  ],
  resource,
});
