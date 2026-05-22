import { imageCache } from "@/services/imageCache";
import { useEffect } from "react";
import { Image } from "react-native";

/**
 * Hook to preload and cache background images
 * Automatically preloads images using Image.prefetch for better performance
 *
 * For images loaded via require(), preloading helps ensure they're ready when needed
 */
export const useBackgroundCaching = (
	imageId: string,
	imageUri: string | number,
) => {
	useEffect(() => {
		const preloadImage = async () => {
			try {
				// Check if already cached
				const cached = await imageCache.get(imageId);
				if (cached) return;

				const resolvedUri =
					typeof imageUri === "string"
						? imageUri
						: Image.resolveAssetSource(imageUri)?.uri;

				// Prefetch the resolved URI so bundled backgrounds are warmed too.
				if (resolvedUri) {
					await Image.prefetch(resolvedUri);
				}

				// Cache the fact that we've preloaded this image
				await imageCache.set(imageId, resolvedUri ?? imageId);
			} catch (error) {
				console.warn(`Failed to preload background image ${imageId}:`, error);
			}
		};

		preloadImage();
	}, [imageId, imageUri]);
};
