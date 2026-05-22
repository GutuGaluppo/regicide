import AsyncStorage from "@react-native-async-storage/async-storage";

interface CachedImage {
	uri: string;
	timestamp: number;
}

const CACHE_KEY_PREFIX = "image_cache_";
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Cache images locally for improved performance and offline support.
 * Uses AsyncStorage to persist cached image URIs.
 */
export const imageCache = {
	/**
	 * Get cached image URI if available and not expired
	 */
	async get(imageId: string): Promise<string | null> {
		try {
			const cached = await AsyncStorage.getItem(CACHE_KEY_PREFIX + imageId);
			if (!cached) return null;

			const { uri, timestamp }: CachedImage = JSON.parse(cached);
			const isExpired = Date.now() - timestamp > CACHE_EXPIRY_MS;

			if (isExpired) {
				await imageCache.remove(imageId);
				return null;
			}

			return uri;
		} catch (error) {
			console.warn(`Failed to get cached image ${imageId}:`, error);
			return null;
		}
	},

	/**
	 * Cache an image URI
	 */
	async set(imageId: string, uri: string): Promise<void> {
		try {
			const cacheData: CachedImage = {
				uri,
				timestamp: Date.now(),
			};
			await AsyncStorage.setItem(
				CACHE_KEY_PREFIX + imageId,
				JSON.stringify(cacheData),
			);
		} catch (error) {
			console.warn(`Failed to cache image ${imageId}:`, error);
		}
	},

	/**
	 * Remove a cached image
	 */
	async remove(imageId: string): Promise<void> {
		try {
			await AsyncStorage.removeItem(CACHE_KEY_PREFIX + imageId);
		} catch (error) {
			console.warn(`Failed to remove cached image ${imageId}:`, error);
		}
	},

	/**
	 * Clear all cached images
	 */
	async clearAll(): Promise<void> {
		try {
			const allKeys = await AsyncStorage.getAllKeys();
			const imageCacheKeys = allKeys.filter((key) =>
				key.startsWith(CACHE_KEY_PREFIX),
			);
			if (imageCacheKeys.length > 0) {
				await Promise.all(
					imageCacheKeys.map((key) => AsyncStorage.removeItem(key)),
				);
			}
		} catch (error) {
			console.warn("Failed to clear image cache:", error);
		}
	},
};
