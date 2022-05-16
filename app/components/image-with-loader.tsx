import { useEffect, useRef, useState } from "react";

import { cx } from "~/utils";

type ImageWithLoaderFallbackProps = {
  isLoading: boolean;
};

type ImageWithLoaderProps = React.ComponentProps<"img"> & {
  fallback({ isLoading }: ImageWithLoaderFallbackProps): React.ReactNode;
};

export function ImageWithLoader({ fallback, ...props }: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [props.src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {/* `alt` is forwarded within `props` */}
      {/* eslint-disable jsx-a11y/alt-text */}
      <img
        {...props}
        className={cx(isLoading && "hidden", props.className)}
        onLoad={(event) => {
          props.onLoad?.(event);
          setIsLoading(false);
        }}
        ref={imgRef}
      />
      {fallback({ isLoading })}
    </>
  );
}
