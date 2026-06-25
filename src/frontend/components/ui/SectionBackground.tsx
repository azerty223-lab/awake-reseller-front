import Image from "next/image";

interface Props {
  src: string;
  /** 0–1 opacity of the raw image layer before overlay */
  imageOpacity?: number;
  objectPosition?: string;
  /** CSS background for the dark overlay on top of the image */
  overlay?: string;
  className?: string;
}

/**
 * Decorative full-bleed background for landing sections.
 * Renders an absolutely-positioned image + a darkening overlay.
 * The parent section must have position:relative and overflow:hidden.
 */
export function SectionBackground({
  src,
  imageOpacity = 1,
  objectPosition = "center center",
  overlay = "rgba(8,8,8,0.86)",
  className = "",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="object-cover"
        style={{ objectPosition, opacity: imageOpacity }}
      />
      <div
        className="absolute inset-0"
        style={{ background: overlay }}
      />
    </div>
  );
}
