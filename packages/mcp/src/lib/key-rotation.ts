import { SERVER_VERSION } from "./constants.js";

/**
 * Manages rotation of multiple API keys to bypass rate limits.
 * Supports round-robin selection and automatic failover on rate limit errors.
 */
export class KeyRotationManager {
    private keys: string[];
    private currentIndex: number = 0;
    private failedKeys: Set<string> = new Set();
    private lastResetTime: number = Date.now();
    private readonly RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

    constructor(apiKeys: string | string[]) {
        if (typeof apiKeys === "string") {
            // Parse comma-separated keys
            this.keys = apiKeys
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k.length > 0);
        } else {
            this.keys = apiKeys.filter((k) => k.length > 0);
        }

        if (this.keys.length === 0) {
            console.warn("[m0x-context] No API keys provided. Running without authentication.");
        } else {
            console.log(`[m0x-context] Loaded ${this.keys.length} API key(s) for rotation`);
        }
    }

    /**
     * Get the next available API key using round-robin strategy.
     * Skips keys that have failed recently.
     * @returns API key string or undefined if no keys available
     */
    getNextKey(): string | undefined {
        // Reset failed keys periodically
        this.resetFailedKeysIfNeeded();

        if (this.keys.length === 0) {
            return undefined;
        }

        // Try to find a non-failed key
        const startIndex = this.currentIndex;
        let attempts = 0;

        while (attempts < this.keys.length) {
            const key = this.keys[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.keys.length;

            if (!this.failedKeys.has(key)) {
                return key;
            }

            attempts++;
        }

        // All keys have failed, reset and return first key
        console.warn(
            "[m0x-context] All API keys are rate-limited. Resetting failed keys and retrying..."
        );
        this.failedKeys.clear();
        return this.keys[0];
    }

    /**
     * Mark a key as failed (rate-limited).
     * @param key The API key that failed
     */
    markKeyFailed(key: string): void {
        if (key && this.keys.includes(key)) {
            this.failedKeys.add(key);
            console.warn(
                `[m0x-context] API key marked as rate-limited (${this.failedKeys.size}/${this.keys.length} failed)`
            );
        }
    }

    /**
     * Reset failed keys after cooldown period.
     */
    private resetFailedKeysIfNeeded(): void {
        const now = Date.now();
        if (now - this.lastResetTime > this.RESET_INTERVAL_MS && this.failedKeys.size > 0) {
            console.log(
                `[m0x-context] Resetting ${this.failedKeys.size} failed API key(s) after cooldown period`
            );
            this.failedKeys.clear();
            this.lastResetTime = now;
        }
    }

    /**
     * Get the total number of keys.
     */
    getTotalKeys(): number {
        return this.keys.length;
    }

    /**
     * Get the number of failed keys.
     */
    getFailedKeysCount(): number {
        return this.failedKeys.size;
    }

    /**
     * Check if any keys are available.
     */
    hasKeys(): boolean {
        return this.keys.length > 0;
    }
}
