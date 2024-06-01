import { bucketStaticPath } from "@/lib/constants";
import Image, { ImageProps } from "next/image";
import { useEffect, useState, useRef } from "react";
import { getItem, setItem, clearOldItems } from "@/lib/indexedDB";

interface CachedImageProps extends Omit<ImageProps, "src"> {
  src?: string;
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
  className,
  sizes,
  placeholder,
  blurDataURL,
  ...rest
}) => {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const isStaticImage = src === defaultImage;
  const isMounted = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return;
    }

    const fetchImage = async () => {
      const cacheKey = getBaseUrl(src);

      // Check the in-memory cache first
      if (imageCache.has(cacheKey)) {
        setImageUrl(imageCache.get(cacheKey) as string);
        return;
      }

      const cachedImage = await getItem(cacheKey);
      const now = Date.now();
      const cacheDuration = isStaticImage
        ? 15 * 24 * 60 * 60 * 1000
        : 3 * 24 * 60 * 60 * 1000;

      if (
        !cachedImage ||
        (cachedImage.timestamp && now - cachedImage.timestamp > cacheDuration)
      ) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const imageObjectURL = URL.createObjectURL(blob);

          await setItem(cacheKey, { blob, timestamp: now });
          imageCache.set(cacheKey, imageObjectURL); // Update in-memory cache
          setImageUrl(imageObjectURL);

          await clearOldItems(cacheDuration);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      } else {
        const imageObjectURL = URL.createObjectURL(cachedImage.blob);
        imageCache.set(cacheKey, imageObjectURL); // Update in-memory cache
        setImageUrl(imageObjectURL);
      }
    };

    if (isMounted.current) {
      fetchImage();
    } else {
      isMounted.current = true;
    }

    return () => {
      isMounted.current = true;
    };
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
