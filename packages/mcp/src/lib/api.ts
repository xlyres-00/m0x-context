import { SearchResponse, ContextRequest, ContextResponse } from "./types.js";
import { ClientContext, generateHeaders } from "./encryption.js";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import { CONTEXT7_API_BASE_URL } from "./constants.js";
import { KeyRotationManager } from "./key-rotation.js";

/**
 * Parses error response from the m0x-context API
 * Extracts the server's error message, falling back to status-based messages if parsing fails
 * @param response The fetch Response object
 * @param apiKey Optional API key (used for fallback messages)
 * @returns Error message string
 */
async function parseErrorResponse(response: Response, apiKey?: string): Promise<string> {
  try {
    const json = (await response.json()) as { message?: string };
    if (json.message) {
      return json.message;
    }
  } catch {
    // JSON parsing failed, fall through to default
  }

  const status = response.status;
  if (status === 429) {
    return apiKey
      ? "Rate limited or quota exceeded. Upgrade your plan at https://context7.com/plans for higher limits."
      : "Rate limited or quota exceeded. Create a free API key at https://context7.com/dashboard for higher limits.";
  }
  if (status === 404) {
    return "The library you are trying to access does not exist. Please try with a different library ID.";
  }
  if (status === 401) {
    return "Invalid API key. Please check your API key. API keys should start with 'ctx7sk' prefix.";
  }
  return `Request failed with status ${status}. Please try again later.`;
}

const PROXY_URL: string | null =
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy ??
  null;

if (PROXY_URL && !PROXY_URL.startsWith("$") && /^(http|https):\/\//i.test(PROXY_URL)) {
  try {
    setGlobalDispatcher(new ProxyAgent(PROXY_URL));
  } catch (error) {
    console.error(
      `[Context7] Failed to configure proxy agent for provided proxy URL: ${PROXY_URL}:`,
      error
    );
  }
}

// Global key rotation manager instance
let keyRotationManager: KeyRotationManager | null = null;

/**
 * Initialize the key rotation manager with API keys.
 * Should be called once during server startup.
 */
export function initializeKeyRotation(apiKeys?: string): void {
  if (apiKeys) {
    keyRotationManager = new KeyRotationManager(apiKeys);
  }
}

/**
 * Get the current key rotation manager instance.
 */
export function getKeyRotationManager(): KeyRotationManager | null {
  return keyRotationManager;
}

/**
 * Searches for libraries matching the given query with automatic key rotation on rate limits.
 * @param query The user's question or task (used for LLM relevance ranking)
 * @param libraryName The library name to search for in the database
 * @param context Client context including IP, API key, and client info
 * @returns Search results or error
 */
export async function searchLibraries(
  query: string,
  libraryName: string,
  context: ClientContext = {}
): Promise<SearchResponse> {
  const maxRetries = keyRotationManager?.getTotalKeys() || 1;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Get next key from rotation manager if available
      const apiKey = keyRotationManager?.getNextKey() || context.apiKey;
      const contextWithKey = { ...context, apiKey };

      const url = new URL(`${CONTEXT7_API_BASE_URL}/v2/libs/search`);
      url.searchParams.set("query", query);
      url.searchParams.set("libraryName", libraryName);

      const headers = generateHeaders(contextWithKey);

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        // Rate limited - mark key as failed and retry with next key
        if (apiKey && keyRotationManager) {
          keyRotationManager.markKeyFailed(apiKey);
          console.warn(`[m0x-context] Rate limited, trying next API key (attempt ${attempt + 1}/${maxRetries})...`);
          continue;
        }
      }

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response, apiKey);
        console.error(errorMessage);
        return { results: [], error: errorMessage };
      }

      const searchData = await response.json();
      return searchData as SearchResponse;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        const errorMessage = `Error searching libraries: ${error}`;
        console.error(errorMessage);
        return { results: [], error: errorMessage };
      }
    }
  }

  return { results: [], error: "All API keys are rate-limited. Please try again later." };
}

/**
 * Fetches intelligent, reranked context for a natural language query with automatic key rotation.
 * @param request The context request parameters (query, libraryId)
 * @param context Client context including IP, API key, and client info
 * @returns Context response with data
 */
export async function fetchLibraryContext(
  request: ContextRequest,
  context: ClientContext = {}
): Promise<ContextResponse> {
  const maxRetries = keyRotationManager?.getTotalKeys() || 1;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Get next key from rotation manager if available
      const apiKey = keyRotationManager?.getNextKey() || context.apiKey;
      const contextWithKey = { ...context, apiKey };

      const url = new URL(`${CONTEXT7_API_BASE_URL}/v2/context`);
      url.searchParams.set("query", request.query);
      url.searchParams.set("libraryId", request.libraryId);

      const headers = generateHeaders(contextWithKey);

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        // Rate limited - mark key as failed and retry with next key
        if (apiKey && keyRotationManager) {
          keyRotationManager.markKeyFailed(apiKey);
          console.warn(`[m0x-context] Rate limited, trying next API key (attempt ${attempt + 1}/${maxRetries})...`);
          continue;
        }
      }

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response, apiKey);
        console.error(errorMessage);
        return { data: errorMessage };
      }

      const text = await response.text();
      if (!text) {
        return {
          data: "Documentation not found or not finalized for this library. This might have happened because you used an invalid m0x-context-compatible library ID. To get a valid m0x-context-compatible library ID, use the 'resolve-library-id' with the package name you wish to retrieve documentation for.",
        };
      }
      return { data: text };
    } catch (error) {
      if (attempt === maxRetries - 1) {
        const errorMessage = `Error fetching library context. Please try again later. ${error}`;
        console.error(errorMessage);
        return { data: errorMessage };
      }
    }
  }

  return { data: "All API keys are rate-limited. Please try again later." };
}
