import type { CSSProperties } from "react";

const SOCRATES_ASSET = "/assets/socrates-closeup-line-art.svg";

type PhilosopherSceneProps = {
  className?: string;
  color?: string;
};

export function PhilosopherScene({
  className,
  color = "#CF5C36",
}: PhilosopherSceneProps) {
  const maskStyle = {
    backgroundColor: color,
    WebkitMask: `url("${SOCRATES_ASSET}") center / contain no-repeat`,
    mask: `url("${SOCRATES_ASSET}") center / contain no-repeat`,
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
