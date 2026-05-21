import type { CSSProperties } from "react";

const TRUMP_JINPING_IMAGE_ASSET = "/assets/trump_jinping.svg";

type PoliticsSceneProps = {
  className?: string;
  color?: string;
};

export function PoliticsScene({
  className,
  color = "#CF5C36",
}: PoliticsSceneProps) {
  const maskStyle = {
    backgroundColor: color,
    WebkitMask: `url("${TRUMP_JINPING_IMAGE_ASSET}") center / contain no-repeat`,
    mask: `url("${TRUMP_JINPING_IMAGE_ASSET}") center / contain no-repeat`,
  } satisfies CSSProperties;

  return (
    <div
      className={`w-full overflow-hidden select-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div
        className="mx-auto h-[220px] w-full max-w-[714px] sm:h-[280px] md:h-[340px]"
        style={maskStyle}
      />
    </div>
  );
}
