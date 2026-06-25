"use client";

interface Props {
  items: string[];
  /** seconds per full loop */
  speed?: number;
  separator?: string;
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
}

/**
 * Marquee — horizontally scrolling text strip.
 * Two copies of the content run side-by-side; when the first reaches -50%
 * it snaps back to 0, creating a seamless infinite loop.
 * Pure CSS — no JS per-frame cost.
 */
export function Marquee({
  items,
  speed = 55,
  separator = "·",
  direction = "left",
  className = "",
  itemClassName = "",
}: Props) {
  const joined = items.join(`  ${separator}  `);

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`flex-shrink-0 ${itemClassName}`}
            style={{ paddingRight: "3rem" }}
          >
            {joined}&ensp;{separator}
          </span>
        ))}
      </div>
    </div>
  );
}
