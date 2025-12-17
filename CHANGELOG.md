# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-12-17

### Breaking Changes

- **Renamed class**: `NextrowsClient` → `Nextrows`
- **Changed constructor signature**: Now accepts an options object instead of positional arguments
  ```typescript
  // Before
  const client = new NextrowsClient("api-key");
  const client = new NextrowsClient("api-key", { timeout: 60000 });

  // After
  const client = new Nextrows({ apiKey: "api-key" });
  const client = new Nextrows({ apiKey: "api-key", timeout: 60000 });
  ```
- **Renamed interface**: `NextrowsClientOptions` → `NextrowsOptions`

### Added

- **Zod schema support**: The `extract` method now accepts Zod schemas in addition to JSON Schema objects (requires Zod 3.24+)
  ```typescript
  import { z } from "zod/v4";

  const schema = z.array(z.object({
    name: z.string(),
    price: z.number()
  }));

  const result = await client.extract({
    type: "url",
    data: ["https://example.com"],
    schema: schema,
  });
  ```
- Added `JsonSchema` type export for explicit JSON Schema typing

## [0.0.5] and earlier

Initial releases with basic API client functionality.
