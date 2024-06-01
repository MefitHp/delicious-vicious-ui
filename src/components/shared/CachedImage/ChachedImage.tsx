import { bucketStaticPath } from "@/lib/constants";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface CachedImageProps extends Omit<ImageProps, "src"> {
  src?: string;
}

const getBaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const baseUrl = urlObj.pathname.replace(/^\//, "");
    return baseUrl;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

const defaultImage = `${bucketStaticPath}/LOGO_WITH_CAT.webp`;

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

  useEffect(() => {
    const fetchImage = async () => {
      const cacheKey = getBaseUrl(src);

      const cachedImage = localStorage.getItem(cacheKey);
      const lastFetch = localStorage.getItem(`${cacheKey}-last-fetch`);
      const now = new Date().getTime();
      const cacheDuration = isStaticImage
        ? 15 * 24 * 60 * 60 * 1000
        : 3 * 24 * 60 * 60 * 1000;

      if (
        !cachedImage ||
        (lastFetch && now - parseInt(lastFetch, 10) > cacheDuration)
      ) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const imageObjectURL = URL.createObjectURL(blob);

          localStorage.setItem(cacheKey, imageObjectURL);
          localStorage.setItem(`${cacheKey}-last-fetch`, now.toString());
          setImageUrl(imageObjectURL);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      } else {
        setImageUrl(cachedImage);
      }
    };

    fetchImage();
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
