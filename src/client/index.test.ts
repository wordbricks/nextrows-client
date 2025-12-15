import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ExtractResponse } from "./index";
import { NextrowsClient } from "./index";

const BASE_URL = "https://api.nextrows.com";

describe("NextrowsClient", () => {
  let client: NextrowsClient;
  const apiKey = "sk-nr-test-api-key";

  beforeEach(() => {
    client = new NextrowsClient(apiKey);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("should be instantiated with api key", () => {
    expect(client).toBeInstanceOf(NextrowsClient);
    expect(client.apiKey).toBe(apiKey);
  });

  it("should allow custom base URL", () => {
    const customClient = new NextrowsClient(apiKey, {
      baseUrl: "https://custom.api.com",
    });
    expect(customClient).toBeInstanceOf(NextrowsClient);
  });

  describe("extract", () => {
    it("should call /v1/extract with correct parameters", async () => {
      const mockResponse: ExtractResponse = {
        rows: [
          { name: "Product 1", price: "$10.00" },
          { name: "Product 2", price: "$20.00" },
        ],
        metadata: {
          sourcesProcessed: 1,
          processingTimeMs: 1234,
        },
      };

      const scope = nock(BASE_URL)
        .post("/v1/extract", {
          type: "url",
          data: ["https://example.com"],
          prompt: "Extract product names and prices",
        })
        .matchHeader("Authorization", `Bearer ${apiKey}`)
        .matchHeader("Content-Type", "application/json")
        .reply(200, mockResponse);

      const response = await client.extract({
        type: "url",
        data: ["https://example.com"],
        prompt: "Extract product names and prices",
      });

      expect(scope.isDone()).toBe(true);
      expect(response).toEqual(mockResponse);
    });

    it("should handle html type extraction", async () => {
      const mockResponse: ExtractResponse = {
        rows: [{ title: "Hello World" }],
      };

      const scope = nock(BASE_URL)
        .post("/v1/extract", {
          type: "html",
          data: ["<html><body><h1>Hello World</h1></body></html>"],
          prompt: "Extract the title",
        })
        .reply(200, mockResponse);

      const response = await client.extract({
        type: "html",
        data: ["<html><body><h1>Hello World</h1></body></html>"],
        prompt: "Extract the title",
      });

      expect(scope.isDone()).toBe(true);
      expect(response.rows).toHaveLength(1);
      expect(response.rows[0].title).toBe("Hello World");
    });

    it("should handle API errors", async () => {
      nock(BASE_URL).post("/v1/extract").reply(401, {
        error: "Unauthorized",
        message: "Invalid API key",
      });

      await expect(
        client.extract({
          type: "url",
          data: ["https://example.com"],
          prompt: "Extract data",
        }),
      ).rejects.toThrow();
    });
  });
});
