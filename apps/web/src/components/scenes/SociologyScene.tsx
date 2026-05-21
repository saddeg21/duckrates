import type { CSSProperties } from "react";

const SOCRATES_ASSET = "/assets/foucault_sociology.svg";

type SociologySceneProps = {
  className?: string;
  color?: string;
};

export function SociologyScene({
  className,
  color = "#CF5C36",
}: SociologySceneProps) {
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
