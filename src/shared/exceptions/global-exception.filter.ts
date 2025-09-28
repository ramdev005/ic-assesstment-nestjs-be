import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import { JSendResponseBuilder } from "@/shared/responses";

/**
 * Global Exception Filter
 * Converts all exceptions to JSEND format responses
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let status: HttpStatus;
    let message: string;
    let code: number | undefined;
    let data: Record<string, any> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || exception.message;

        // Handle validation errors
        if (responseObj.message && Array.isArray(responseObj.message)) {
          // Validation errors - return as fail response
          const validationErrors: Record<string, string[]> = {};
          responseObj.message.forEach((error: string) => {
            const [field, ...messageParts] = error.split(" ");
            const fieldName = field || "general";
            if (!validationErrors[fieldName]) {
              validationErrors[fieldName] = [];
            }
            validationErrors[fieldName].push(messageParts.join(" ") || error);
          });

          response.status(status).json(
            JSendResponseBuilder.fail({
              errors: validationErrors,
              timestamp,
              path,
            })
          );
          return;
        }
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error occurred.";
      code = 5001;
      data = {
        timestamp,
        path,
        method,
      };

      // Log the actual error for debugging
      this.logger.error(
        `Internal Server Error: ${exception.message}`,
        exception.stack,
        `${method} ${path}`
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "An unexpected error occurred.";
      code = 5000;
      data = {
        timestamp,
        path,
        method,
      };

      this.logger.error(
        `Unexpected Error: ${String(exception)}`,
        undefined,
        `${method} ${path}`
      );
    }

    // Determine if it's a client error (4xx) or server error (5xx)
    if (status >= 400 && status < 500) {
      // Client error - use fail response for 4xx errors
      response.status(status).json(
        JSendResponseBuilder.fail({
          message,
          timestamp,
          path,
          statusCode: status,
        })
      );
    } else {
      // Server error - use error response for 5xx errors
      response
        .status(status)
        .json(JSendResponseBuilder.error(message, code, data));
    }
  }
}
