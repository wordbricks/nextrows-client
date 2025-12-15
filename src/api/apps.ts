import type { AxiosInstance } from "axios";

/**
 * Input value type for app parameters.
 */
export type AppInputValue = string | number | boolean;

/**
 * Input parameter for running an app.
 */
export interface AppInput {
  /**
   * The input parameter key.
   * @example "url"
   */
  key: string;

  /**
   * The input parameter value.
   * @example "https://example.com"
   */
  value: AppInputValue;
}

/**
 * Request parameters for the run app JSON API endpoint.
 */
export interface RunAppJsonRequest {
  /**
   * The ID of the app to run.
   * @example "abc123xyz"
   */
  appId: string;

  /**
   * Array of input parameters for the app. Each input has a key-value pair.
   *
   * @example
   * ```typescript
   * [
   *   { key: "url", value: "https://example.com/products" },
   *   { key: "maxItems", value: 10 }
   * ]
   * ```
   */
  inputs: AppInput[];
}

/**
 * Cell value type for app output rows.
 */
export type AppCellValue = string | number | boolean;

/**
 * The structured JSON output data from an app run.
 */
export interface RunAppJsonData {
  /**
   * Column headers of the result table.
   * @example ["Name", "Price", "URL"]
   */
  columns: string[];

  /**
   * Rows of data in the result table.
   * Each row is an array of cell values corresponding to the columns.
   *
   * @example
   * ```typescript
   * [
   *   ["Product A", 29.99, "https://example.com/product-a"],
   *   ["Product B", 49.99, "https://example.com/product-b"]
   * ]
   * ```
   */
  rows: AppCellValue[][];
}

/**
 * Response from the run app JSON API endpoint.
 */
export interface RunAppJsonResponse {
  /**
   * Whether the request was successful.
   */
  success: boolean;

  /**
   * The structured JSON output from the app (present when success is true).
   */
  data?: RunAppJsonData;

  /**
   * Unique identifier for this run.
   * @example "run_abc123"
   */
  runId?: string;

  /**
   * Time taken to execute the app in milliseconds.
   * @example 2500
   */
  elapsedTime?: number;

  /**
   * Error message (present when success is false).
   */
  error?: string;
}

/**
 * Run a published NextRows app and get JSON output.
 *
 * Executes a published NextRows app with the provided inputs and returns
 * the result as structured JSON data. The response includes column headers
 * and row data that can be easily integrated into your applications.
 *
 * @param client - The Axios instance to use for the request
 * @param request - The run app request parameters
 * @returns Promise resolving to the app run response with success status and structured data
 * @throws {AxiosError} When the API request fails (e.g., 401 for invalid API key, 402 for credits exhausted, 404 for app not found)
 *
 * @example
 * ```typescript
 * const result = await client.runAppJson({
 *   appId: "abc123xyz",
 *   inputs: [
 *     { key: "url", value: "https://example.com/products" },
 *     { key: "maxItems", value: 10 }
 *   ]
 * });
 *
 * if (result.success && result.data) {
 *   console.log("Columns:", result.data.columns);
 *   console.log("Rows:", result.data.rows);
 *   console.log(`Run ID: ${result.runId}`);
 *   console.log(`Elapsed time: ${result.elapsedTime}ms`);
 * }
 * ```
 */
export async function runAppJson(
  client: AxiosInstance,
  request: RunAppJsonRequest,
): Promise<RunAppJsonResponse> {
  const response = await client.post<RunAppJsonResponse>(
    "/v1/apps/run/json",
    request,
  );
  return response.data;
}
