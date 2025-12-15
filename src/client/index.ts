import type { AxiosInstance } from "axios";
import axios from "axios";

const BASE_URL = "https://api.nextrows.com";

export type ExtractType = "url" | "html";

export interface ExtractRequest {
  /** Type of data to extract from */
  type: ExtractType;
  /** Array of URLs or HTML strings to extract data from */
  data: string[];
  /** Natural language prompt describing what data to extract */
  prompt: string;
}

export interface ExtractedRow {
  [key: string]: unknown;
}

export interface ExtractResponse {
  /** Extracted data rows */
  rows: ExtractedRow[];
  /** Additional metadata about the extraction */
  metadata?: {
    /** Number of sources processed */
    sourcesProcessed: number;
    /** Processing time in milliseconds */
    processingTimeMs: number;
  };
}

export interface NextrowsClientOptions {
  /** Base URL for the API (defaults to https://api.nextrows.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
}

export class NextrowsClient {
  private readonly client: AxiosInstance;

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
   * Extract structured data from URLs or HTML content using AI
   * @param request - The extraction request parameters
   * @returns The extracted data
   */
  async extract(request: ExtractRequest): Promise<ExtractResponse> {
    const response = await this.client.post<ExtractResponse>(
      "/v1/extract",
      request,
    );
    return response.data;
  }
}
