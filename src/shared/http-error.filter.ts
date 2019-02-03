import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost){

        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus 
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: new Date().toUTCString(),
            path: request.url,
            method: request.method,
            error: exception.message.error,
            message:
                (status !== HttpStatus.INTERNAL_SERVER_ERROR)
                    ? (exception.message.error || exception.message || null)
                    : 'Internal server error',
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(
              `${request.method} ${request.url}`,
              exception.stack,
              'ExceptionFilter',
            );
          } else {
            Logger.error(
              `${request.method} ${request.url}`,
              JSON.stringify(errorResponse),
              'ExceptionFilter',
            );
      }

        response.status(status).json(errorResponse);
    }
}