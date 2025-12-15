import type { AxiosInstance } from "axios";

/**
 * The type of data source to extract from.
 * - `"url"` - Extract data from web page URLs
 * - `"text"` - Extract data from raw text content
 */
export type ExtractType = "url" | "text";

/**
 * JSON Schema definition for structured extraction output.
 * Must conform to JSON Schema specification.
 *
 * @example
 * ```typescript
 * // Schema for extracting a table as 2D array
 * const schema: ExtractSchema = {
 *   type: "array",
 *   items: {
 *     type: "array",
 *     items: { type: "string" }
 *   }
 * };
 *
 * // Schema for extracting product objects
 * const schema: ExtractSchema = {
 *   type: "array",
 *   items: {
 *     type: "object",
 *     properties: {
 *       name: { type: "string" },
 *       price: { type: "number" }
 *     }
 *   }
 * };
 * ```
 */
export interface ExtractSchema {
  [key: string]: unknown;
}

/**
 * Request parameters for the extract API endpoint.
 */
export interface ExtractRequest {
  /**
   * The type of data source to extract from.
   * - `"url"` - Provide valid web page URLs in the `data` array
   * - `"text"` - Provide raw text content in the `data` array
   */
  type: ExtractType;

  /**
   * Array of data sources to extract from.
   * - If `type` is `"url"`, provide valid URLs (e.g., `["https://example.com"]`)
   * - If `type` is `"text"`, provide raw text content
   *
   * @minItems 1
   * @maxItems 20
   */
  data: string[];

  /**
   * Optional natural language prompt describing what data to extract.
   *
   * @maxLength 2000
   * @example "Extract the top 10 companies from the list in a table format."
   */
  prompt?: string;

  /**
   * Optional JSON Schema for consistent and predictable extraction results.
   * If not provided, the system will auto-generate the structure based on the data.
   *
   * @example
   * ```json
   * {
   *   "type": "array",
   *   "items": {
   *     "type": "object",
   *     "properties": {
   *       "name": { "type": "string" },
   *       "price": { "type": "number" }
   *     }
   *   }
   * }
   * ```
   */
  schema?: ExtractSchema;
}

/**
 * Response from the extract API endpoint.
 */
export interface ExtractResponse {
  /**
   * Whether the request was successful.
   * Always `true` for successful responses.
   */
  success: boolean;

  /**
   * The extracted data.
   * Structure depends on the provided schema or is auto-generated based on the data.
   */
  data?: unknown;
}

/**
 * Extract structured data from URLs or text content using AI.
 *
 * This endpoint processes the provided data sources and extracts structured
 * information based on the optional prompt and schema.
 *
 * @param client - The Axios instance to use for the request
 * @param request - The extraction request parameters
 * @returns Promise resolving to the extraction response with success status and extracted data
 * @throws {AxiosError} When the API request fails (e.g., 401 for invalid API key)
 *
 * @example
 * ```typescript
 * // Extract from URL with a prompt
 * const result = await client.extract({
 *   type: "url",
 *   data: ["https://example.com/products"],
 *   prompt: "Extract product names and prices as a table"
 * });
 *
 * // Extract from text with a schema for consistent output
 * const result = await client.extract({
 *   type: "text",
 *   data: ["Product A costs $10, Product B costs $20"],
 *   schema: {
 *     type: "array",
 *     items: {
 *       type: "object",
 *       properties: {
 *         name: { type: "string" },
 *         price: { type: "number" }
 *       }
 *     }
 *   }
 * });
 *
 * if (result.success) {
 *   console.log(result.data);
 * }
 * ```
 */
export async function extract(
  client: AxiosInstance,
  request: ExtractRequest,
): Promise<ExtractResponse> {
  const response = await client.post<ExtractResponse>("/v1/extract", request);
  return response.data;
}
