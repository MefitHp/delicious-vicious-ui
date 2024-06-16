import { bucketStaticPath } from "@/lib/constants";
import Image, { ImageProps } from "next/image";
import { useEffect, useState, useRef } from "react";
import { getItem, setItem, clearOldItems } from "@/lib/indexedDB";

interface CachedImageProps extends Omit<ImageProps, "src"> {
  src?: string;
  isStatic?: boolean;
}

const getBaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const baseUrl = urlObj.pathname;
    return baseUrl;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

const defaultImage = `${bucketStaticPath}/LOGO_WITH_CAT.webp`;

// In-memory cache for images
const imageCache: Map<string, string> = new Map();

const CachedImage: React.FC<CachedImageProps> = ({
  src = defaultImage,
  alt,
  isStatic = false,
  className,
  sizes,
  placeholder,
  blurDataURL,
  ...rest
}) => {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const isStaticImage = src === defaultImage || isStatic;
  const isMounted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      console.log("IndexedDB is not available.");
      return;
    }

    const fetchImage = async () => {
      console.log("Fetching image...");
      const cacheKey = getBaseUrl(src);
      console.log("Cache key:", cacheKey);

      // Check the in-memory cache first
      if (imageCache.has(cacheKey)) {
        console.log("Image found in memory cache.");
        setImageUrl(imageCache.get(cacheKey) as string);
        return;
      }

      const cachedImage = await getItem(cacheKey);
      console.log("Cached image from IndexedDB:", cachedImage);
      const now = Date.now();
      const cacheDuration = isStaticImage
        ? 15 * 24 * 60 * 60 * 1000
        : 3 * 24 * 60 * 60 * 1000;
      console.log("Cache duration:", cacheDuration);

      if (
        !cachedImage ||
        (cachedImage.timestamp && now - cachedImage.timestamp > cacheDuration)
      ) {
        try {
          console.log("Fetching image from network...");
          const response = await fetch(src, { mode: "no-cors" });
          const blob = await response.blob();
          const imageObjectURL = URL.createObjectURL(blob);
          console.log("Image fetched from network:", imageObjectURL);

          await setItem(cacheKey, { blob, timestamp: now });
          console.log("Image stored in IndexedDB.");

          imageCache.set(cacheKey, imageObjectURL); // Update in-memory cache
          setImageUrl(imageObjectURL);

          await clearOldItems(cacheDuration);
          console.log("Old items cleared from IndexedDB.");
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      } else {
        const imageObjectURL = URL.createObjectURL(cachedImage.blob);
        imageCache.set(cacheKey, imageObjectURL); // Update in-memory cache
        setImageUrl(imageObjectURL);
        console.log("Image URL set from cached image.");
      }
    };

    fetchImage();

    if (!isMounted.current) {
      console.log("Component mounted.");
      isMounted.current = true;
    }
  }, [src, isStaticImage]);

  return (
    <Image
      className={className}
      src={imageUrl}
      fill
      sizes={sizes}
      alt={alt}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      {...rest}
    />
  );
};

export default CachedImage;
