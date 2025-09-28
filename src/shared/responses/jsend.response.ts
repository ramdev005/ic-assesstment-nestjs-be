/**
 * JSEND Response Format Implementation
 * Based on JSEND specification: https://github.com/omniti-labs/jsend
 */

export enum JSendStatus {
  SUCCESS = "success",
  FAIL = "fail",
  ERROR = "error",
}

export interface JSendSuccessResponse<T = any> {
  status: JSendStatus.SUCCESS;
  data: T;
}

export interface JSendFailResponse {
  status: JSendStatus.FAIL;
  data: Record<string, any>;
}

export interface JSendErrorResponse {
  status: JSendStatus.ERROR;
  message: string;
  code?: number;
  data?: Record<string, any>;
}

export type JSendResponse<T = any> =
  | JSendSuccessResponse<T>
  | JSendFailResponse
  | JSendErrorResponse;

/**
 * JSEND Response Builder
 * Utility class to create standardized JSEND responses
 */
export class JSendResponseBuilder {
  /**
   * Create a success response
   * @param data The response data
   * @returns JSendSuccessResponse
   */
  static success<T>(data: T): JSendSuccessResponse<T> {
    return {
      status: JSendStatus.SUCCESS,
      data,
    };
  }

  /**
   * Create a fail response (client error)
   * @param data The validation errors or failure data
   * @returns JSendFailResponse
   */
  static fail(data: Record<string, any>): JSendFailResponse {
    return {
      status: JSendStatus.FAIL,
      data,
    };
  }

  /**
   * Create an error response (server error)
   * @param message The error message
   * @param code Optional error code
   * @param data Optional additional data
   * @returns JSendErrorResponse
   */
  static error(
    message: string,
    code?: number,
    data?: Record<string, any>
  ): JSendErrorResponse {
    const response: JSendErrorResponse = {
      status: JSendStatus.ERROR,
      message,
    };

    if (code !== undefined) {
      response.code = code;
    }

    if (data !== undefined) {
      response.data = data;
    }

    return response;
  }
}
