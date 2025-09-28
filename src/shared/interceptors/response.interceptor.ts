import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { JSendResponseBuilder } from "@/shared/responses";

/**
 * Response Interceptor
 * Automatically wraps successful responses in JSEND format
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Handle empty responses (like DELETE operations)
        if (data === undefined || data === null) {
          return JSendResponseBuilder.success(null);
        }

        // If data is already in JSEND format, return as is
        if (this.isJSendResponse(data)) {
          return data;
        }

        // Wrap the response data in JSEND success format
        return JSendResponseBuilder.success(data);
      })
    );
  }

  private isJSendResponse(data: any): boolean {
    return (
      data &&
      typeof data === "object" &&
      "status" in data &&
      ["success", "fail", "error"].includes(data.status)
    );
  }
}
