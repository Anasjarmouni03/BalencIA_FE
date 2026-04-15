"use client";

import { useState } from "react";
import { getInitials } from "@/lib/profile-images";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-8 h-8 text-caption",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export default function Avatar({
  name,
  imageUrl,
  size = "md",
  className = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;

  return (
    <div
      className={[
        "rounded-full overflow-hidden shrink-0 border border-border bg-brand-subtle flex items-center justify-center",
        SIZE_CLASS[size],
        className,
      ].join(" ")}
      aria-label={`${name} profile`}
      title={name}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={`${name} profile`}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-semibold text-[#2f8876]">{getInitials(name)}</span>
      )}
    </div>
  );
}
