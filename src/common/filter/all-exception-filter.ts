import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    if (
      exception instanceof BadRequestException &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse.hasOwnProperty('message')
    ) {
      if (Array.isArray((exceptionResponse as any).message)) {
        message = (exceptionResponse as any).message
          .map((err) => err.errors.join(', '))
          .join(', ');
      } else {
        message = (exceptionResponse as any).message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
