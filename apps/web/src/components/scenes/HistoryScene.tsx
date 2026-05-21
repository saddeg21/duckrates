import type { CSSProperties } from "react";

const ADAM_AND_EVE_ASSET = "/assets/napeleon.svg";

type HistorySceneProps = {
  className?: string;
  color?: string;
};

export function HistoryScene({
  className,
  color = "#CF5C36",
}: HistorySceneProps) {
  const maskStyle = {
    backgroundColor: color,
    WebkitMask: `url("${ADAM_AND_EVE_ASSET}") center / contain no-repeat`,
    mask: `url("${ADAM_AND_EVE_ASSET}") center / contain no-repeat`,
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
