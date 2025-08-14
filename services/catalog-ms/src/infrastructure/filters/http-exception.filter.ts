/* eslint-disable import/no-extraneous-dependencies */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const span = trace.getSpan(context.active());
    const traceId = span ? span.spanContext().traceId : null;
    const spanId = span ? span.spanContext().spanId : null;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponseData = exception.getResponse() as any;

    const code = errorResponseData?.code || 'INTERNAL_SERVER_ERROR';

    const message =
      errorResponseData?.message ||
      exception.message ||
      'Internal Server Error';

    const responseData = {
      ...errorResponseData,
      code,
      spanId,
      traceId,
      message,
      statusCode: exception.getStatus(),
    };

    span?.setAttribute(
      'response.error.response_data',
      JSON.stringify(responseData, null, 2),
    );

    return response.status(exception.getStatus()).json(responseData);
  }
}
