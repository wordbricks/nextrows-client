import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  type RunAppJsonRequest,
  type RunAppJsonResponse,
  runAppJson,
} from "../api/apps";
import { type GetCreditsResponse, getCredits } from "../api/credits";
import {
  type ExtractRequest,
  type ExtractResponse,
  extract,
} from "../api/extract";

export type {
  AppCellValue,
  AppInput,
  AppInputValue,
  RunAppJsonData,
  RunAppJsonRequest,
  RunAppJsonResponse,
} from "../api/apps";
export type { GetCreditsResponse } from "../api/credits";
export type {
  ExtractRequest,
  ExtractResponse,
  ExtractSchema,
  ExtractType,
} from "../api/extract";

const BASE_URL = "https://api.nextrows.com";

/**
 * Configuration options for the Nextrows API client.
 */
export interface NextrowsClientOptions {
  /**
   * Base URL for the API.
   * @default "https://api.nextrows.com"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;
}

/**
 * Client for interacting with the Nextrows API.
 *
 * @example
 * ```typescript
 * import { NextrowsClient } from "nextrows";
 *
 * const client = new NextrowsClient("your-api-key");
 *
 * // Extract data from a URL
 * const result = await client.extract({
 *   type: "url",
 *   data: ["https://example.com/products"],
 *   prompt: "Extract all product names and prices"
 * });
 *
 * console.log(result.data);
 * ```
 */
export class NextrowsClient {
  private readonly client: AxiosInstance;

  /**
   * Creates a new Nextrows API client.
   *
   * @param apiKey - Your Nextrows API key (Bearer token)
   * @param options - Optional client configuration
   *
   * @example
   * ```typescript
   * // Basic usage
   * const client = new NextrowsClient("sk-nr-your-api-key");
   *
   * // With custom options
   * const client = new NextrowsClient("sk-nr-your-api-key", {
   *   timeout: 60000, // 60 second timeout
   * });
   * ```
   */
  constructor(
    readonly apiKey: string,
    options: NextrowsClientOptions = {},
  ) {
    const { baseUrl = BASE_URL, timeout = 30000 } = options;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Extract structured data from URLs or text content using AI.
   * @see {@link extract} for detailed documentation
   */
  async extract(request: ExtractRequest): Promise<ExtractResponse> {
    return extract(this.client, request);
  }

  /**
   * Get the current credit balance for the authenticated user.
   * @see {@link getCredits} for detailed documentation
   */
  async getCredits(): Promise<GetCreditsResponse> {
    return getCredits(this.client);
  }

  /**
   * Run a published NextRows app and get JSON output.
   *
   * Executes a published NextRows app with the provided inputs and returns
   * the result as structured JSON data.
   *
   * @see {@link runAppJson} for detailed documentation
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
   * }
   * ```
   */
  async runAppJson(request: RunAppJsonRequest): Promise<RunAppJsonResponse> {
    return runAppJson(this.client, request);
  }
}
