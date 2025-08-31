// =============================================================================
// HTTP CLIENT WITH INTERCEPTORS AND RETRY LOGIC
// =============================================================================

import { logger, apiLogger, createPerformanceLogger } from "./logger";
import {
  createAPIError,
  ErrorCode,
  isRetryableError,
  AppError,
} from "./errors";

export interface HTTPRequestConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  retryBackoff?: "linear" | "exponential";
  validateStatus?: (status: number) => boolean;
}

export interface HTTPResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HTTPRequestConfig;
  requestId: string;
}

export interface HTTPError extends AppError {
  status?: number;
  statusText?: string;
  response?: HTTPResponse;
  request?: HTTPRequestConfig;
}

export interface Interceptor {
  request?: (
    config: HTTPRequestConfig
  ) => HTTPRequestConfig | Promise<HTTPRequestConfig>;
  response?: (response: HTTPResponse) => HTTPResponse | Promise<HTTPResponse>;
  error?: (error: HTTPError) => HTTPError | Promise<HTTPError>;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryBackoff: "linear" | "exponential";
  retryableStatuses: number[];
  retryableErrors: ErrorCode[];
}

class HTTPClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private interceptors: Interceptor[] = [];
  private retryConfig: RetryConfig;

  constructor(
    config: {
      baseURL?: string;
      defaultHeaders?: Record<string, string>;
      defaultTimeout?: number;
      retryConfig?: Partial<RetryConfig>;
    } = {}
  ) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.defaultHeaders,
    };
    this.defaultTimeout = config.defaultTimeout || 30000;
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryBackoff: "exponential",
      retryableStatuses: [408, 429, 500, 502, 503, 504],
      retryableErrors: [
        ErrorCode.API_NETWORK_ERROR,
        ErrorCode.API_TIMEOUT,
        ErrorCode.API_RATE_LIMITED,
        ErrorCode.API_SERVER_ERROR,
      ],
      ...config.retryConfig,
    };
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  public async request<T = unknown>(
    config: HTTPRequestConfig
  ): Promise<HTTPResponse<T>> {
    const requestId = this.generateRequestId();
    const perfLogger = createPerformanceLogger(
      `HTTP ${config.method} ${config.url}`
    );

    try {
      // Apply request interceptors
      let finalConfig = await this.applyRequestInterceptors(config);

      // Add default headers and timeout
      finalConfig = this.mergeConfig(finalConfig);

      // Execute request with retry logic
      const response = await this.executeWithRetry(finalConfig, requestId);

      // Apply response interceptors
      const finalResponse = await this.applyResponseInterceptors(response);

      perfLogger.finish({ requestId, status: finalResponse.status });
      return finalResponse;
    } catch (error) {
      const httpError = this.normalizeError(error, config, requestId);

      // Apply error interceptors
      const finalError = await this.applyErrorInterceptors(httpError);

      perfLogger.finish({ requestId, error: finalError.code });
      throw finalError;
    }
  }

  public async get<T = unknown>(
    url: string,
    config?: Partial<HTTPRequestConfig>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>({ method: "GET", url, ...config });
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<HTTPRequestConfig>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>({ method: "POST", url, body: data, ...config });
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<HTTPRequestConfig>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>({ method: "PUT", url, body: data, ...config });
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Partial<HTTPRequestConfig>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>({ method: "PATCH", url, body: data, ...config });
  }

  public async delete<T = unknown>(
    url: string,
    config?: Partial<HTTPRequestConfig>
  ): Promise<HTTPResponse<T>> {
    return this.request<T>({ method: "DELETE", url, ...config });
  }

  // =============================================================================
  // INTERCEPTOR MANAGEMENT
  // =============================================================================

  public addInterceptor(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
  }

  public removeInterceptor(interceptor: Interceptor): void {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  public clearInterceptors(): void {
    this.interceptors = [];
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private async applyRequestInterceptors(
    config: HTTPRequestConfig
  ): Promise<HTTPRequestConfig> {
    let finalConfig = config;

    for (const interceptor of this.interceptors) {
      if (interceptor.request) {
        finalConfig = await interceptor.request(finalConfig);
      }
    }

    return finalConfig;
  }

  private async applyResponseInterceptors(
    response: HTTPResponse
  ): Promise<HTTPResponse> {
    let finalResponse = response;

    for (const interceptor of this.interceptors) {
      if (interceptor.response) {
        finalResponse = await interceptor.response(finalResponse);
      }
    }

    return finalResponse;
  }

  private async applyErrorInterceptors(error: HTTPError): Promise<HTTPError> {
    let finalError = error;

    for (const interceptor of this.interceptors) {
      if (interceptor.error) {
        finalError = await interceptor.error(finalError);
      }
    }

    return finalError;
  }

  private mergeConfig(config: HTTPRequestConfig): HTTPRequestConfig {
    return {
      timeout: this.defaultTimeout,
      retries: this.retryConfig.maxRetries,
      retryDelay: this.retryConfig.retryDelay,
      retryBackoff: this.retryConfig.retryBackoff,
      validateStatus: (status: number) => status >= 200 && status < 300,
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };
  }

  private async executeWithRetry(
    config: HTTPRequestConfig,
    requestId: string
  ): Promise<HTTPResponse> {
    let lastError: HTTPError;

    for (let attempt = 0; attempt <= (config.retries || 0); attempt++) {
      try {
        return await this.executeRequest(config, requestId);
      } catch (error) {
        lastError = this.normalizeError(error, config, requestId);

        // Check if we should retry
        if (
          attempt < (config.retries || 0) &&
          this.shouldRetry(lastError, config)
        ) {
          const delay = this.calculateRetryDelay(attempt, config);
          apiLogger.warn(
            `Retrying request (attempt ${attempt + 1}/${config.retries})`,
            {
              requestId,
              attempt: attempt + 1,
              delay,
              error: lastError.code,
            }
          );

          await this.sleep(delay);
          continue;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }

  private async executeRequest(
    config: HTTPRequestConfig,
    requestId: string
  ): Promise<HTTPResponse> {
    const url = this.buildURL(config.url);
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || this.defaultTimeout
    );

    try {
      const response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const data = await this.parseResponse(response);

      // Validate status
      if (config.validateStatus && !config.validateStatus(response.status)) {
        throw createAPIError(
          this.getErrorCodeForStatus(response.status),
          `HTTP ${response.status}: ${response.statusText}`,
          {
            requestId,
            status: response.status,
            statusText: response.statusText,
          }
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
        config,
        requestId,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw createAPIError(ErrorCode.API_TIMEOUT, "Request timeout", {
            requestId,
            timeout: config.timeout,
          });
        }
      }

      throw error;
    }
  }

  private shouldRetry(error: HTTPError, config: HTTPRequestConfig): boolean {
    // Check if error is retryable
    if (isRetryableError(error)) {
      return true;
    }

    // Check if status code is retryable
    if (
      error.status &&
      this.retryConfig.retryableStatuses.includes(error.status)
    ) {
      return true;
    }

    // Check if error code is retryable
    if (this.retryConfig.retryableErrors.includes(error.code)) {
      return true;
    }

    return false;
  }

  private calculateRetryDelay(
    attempt: number,
    config: HTTPRequestConfig
  ): number {
    const baseDelay = config.retryDelay || this.retryConfig.retryDelay;
    const backoff = config.retryBackoff || this.retryConfig.retryBackoff;

    if (backoff === "exponential") {
      return baseDelay * Math.pow(2, attempt);
    } else {
      return baseDelay * (attempt + 1);
    }
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }

    if (contentType?.includes("text/")) {
      return await response.text();
    }

    return await response.arrayBuffer();
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private buildURL(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${this.baseURL}${url}`;
  }

  private getErrorCodeForStatus(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.API_BAD_REQUEST;
      case 401:
        return ErrorCode.API_UNAUTHORIZED;
      case 403:
        return ErrorCode.API_FORBIDDEN;
      case 404:
        return ErrorCode.API_NOT_FOUND;
      case 408:
        return ErrorCode.API_TIMEOUT;
      case 429:
        return ErrorCode.API_RATE_LIMITED;
      case 500:
        return ErrorCode.API_SERVER_ERROR;
      case 502:
        return ErrorCode.API_SERVER_ERROR;
      case 503:
        return ErrorCode.API_SERVER_ERROR;
      case 504:
        return ErrorCode.API_SERVER_ERROR;
      default:
        return ErrorCode.API_SERVER_ERROR;
    }
  }

  private normalizeError(
    error: unknown,
    config: HTTPRequestConfig,
    requestId: string
  ): HTTPError {
    if (error instanceof Error) {
      return {
        ...createAPIError(ErrorCode.API_NETWORK_ERROR, error.message, {
          requestId,
          endpoint: config.url,
          method: config.method,
        }),
        request: config,
      } as HTTPError;
    }

    return {
      ...createAPIError(ErrorCode.API_NETWORK_ERROR, "Unknown network error", {
        requestId,
        endpoint: config.url,
        method: config.method,
      }),
      request: config,
    } as HTTPError;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// =============================================================================
// DEFAULT INSTANCES
// =============================================================================

// Main HTTP client instance
export const httpClient = new HTTPClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  defaultHeaders: {
    "X-Client-Version": "1.0.0",
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryBackoff: "exponential",
  },
});

// Specialized clients for different services
export const zapierClient = new HTTPClient({
  baseURL: import.meta.env.VITE_ZAPIER_WEBHOOK_URL || "",
  defaultHeaders: {
    Authorization: `Bearer ${import.meta.env.VITE_ZAPIER_API_KEY}`,
    "X-Service": "zapier",
  },
  retryConfig: {
    maxRetries: 2,
    retryDelay: 2000,
    retryBackoff: "linear",
  },
});

export const supabaseClient = new HTTPClient({
  baseURL: import.meta.env.VITE_SUPABASE_URL || "",
  defaultHeaders: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  },
  retryConfig: {
    maxRetries: 1,
    retryDelay: 500,
    retryBackoff: "linear",
  },
});

// =============================================================================
// COMMON INTERCEPTORS
// =============================================================================

// Request logging interceptor
export const loggingInterceptor: Interceptor = {
  request: (config) => {
    apiLogger.info(`Making ${config.method} request to ${config.url}`, {
      method: config.method,
      url: config.url,
      headers: config.headers,
      body: config.body,
    });
    return config;
  },
  response: (response) => {
    apiLogger.info(`Received response from ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      requestId: response.requestId,
    });
    return response;
  },
  error: (error) => {
    apiLogger.error(`Request failed: ${error.message}`, error, {
      requestId: error.context.requestId,
      status: error.status,
      endpoint: error.context.endpoint,
      method: error.context.method,
    });
    return error;
  },
};

// Add logging interceptor to main client
httpClient.addInterceptor(loggingInterceptor);
zapierClient.addInterceptor(loggingInterceptor);
supabaseClient.addInterceptor(loggingInterceptor);
