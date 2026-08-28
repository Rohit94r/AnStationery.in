"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { placeholderImage } from "@/lib/placeholder";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackEmoji?: string;
  fallbackLabel?: string;
};

export function SafeImage({
  src,
  alt,
  fallbackEmoji,
  fallbackLabel,
  className,
  ...rest
}: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  const finalSrc =
    errored || !src
      ? placeholderImage({
          emoji: fallbackEmoji,
          label: fallbackLabel ?? (alt as string),
        })
      : src;

  return (
    <Image
      src={finalSrc}
      alt={(alt as string) ?? ""}
      className={className}
      onError={() => setErrored(true)}
      unoptimized={errored || !src}
      {...rest}
    />
  );
}
