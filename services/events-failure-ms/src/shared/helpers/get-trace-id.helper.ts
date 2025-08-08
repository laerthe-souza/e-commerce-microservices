import { context, trace } from '@opentelemetry/api';

export function getTraceId(): string | null {
  const span = trace.getSpan(context.active());
  const traceId = span ? span.spanContext().traceId : null;

  return traceId;
}
